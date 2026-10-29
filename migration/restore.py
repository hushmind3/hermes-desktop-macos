#!/usr/bin/env python3
"""Install Hermes first; restore authenticated, encrypted data and exact custom source."""
import argparse,hashlib,hmac,json,os,re,shutil,sqlite3,stat,subprocess,sys,tarfile,tempfile,time,zipfile
from pathlib import Path,PurePosixPath


def run(args,**kw):
    subprocess.run([str(x) for x in args],check=True,**kw)


def inside(name):
    p=PurePosixPath(name)
    if p.is_absolute() or '..' in p.parts:raise ValueError('Unsafe archive path: '+name)
    return p


def extract_tar(archive,target):
    links=[]
    with tarfile.open(archive) as t:
        for item in t:
            rel=inside(item.name);dst=target/str(rel)
            if item.isdir():dst.mkdir(parents=True,exist_ok=True)
            elif item.isfile():
                dst.parent.mkdir(parents=True,exist_ok=True)
                with t.extractfile(item) as src,dst.open('wb') as out:shutil.copyfileobj(src,out)
                dst.chmod(item.mode & 0o777)
            elif item.issym() or item.islnk():links.append(item)
            else:raise ValueError('Unsupported archive entry')
        for item in links:
            dst=target/str(inside(item.name));dst.parent.mkdir(parents=True,exist_ok=True)
            if item.issym():dst.symlink_to(item.linkname)
            else:shutil.copy2(target/str(inside(item.linkname)),dst)


def rewrite_text(path,old,new):
    if path.is_symlink() or not path.is_file() or path.stat().st_size>8*1024*1024:return
    data=path.read_bytes()
    if b'\0' in data or old.encode() not in data:return
    try:text=data.decode('utf-8')
    except UnicodeDecodeError:return
    path.write_text(text.replace(old,new),encoding='utf-8')


def portable_zip(source,dest,old,new):
    with zipfile.ZipFile(source) as src,zipfile.ZipFile(dest,'w',zipfile.ZIP_DEFLATED) as out:
        for member in src.infolist():
            inside(member.filename)
            if member.is_dir():continue
            data=src.read(member)
            if len(data)<=8*1024*1024 and b'\0' not in data and old.encode() in data:
                try:data=data.decode('utf-8').replace(old,new).encode('utf-8')
                except UnicodeDecodeError:pass
            out.writestr(member,data)


def verify_dbs(root):
    result={}
    for path in root.rglob('*.db'):
        if path.is_symlink():continue
        with path.open('rb') as f:header=f.read(16)
        if header!=b'SQLite format 3\0':continue
        conn=sqlite3.connect(path.as_uri()+'?mode=ro',uri=True)
        try:
            if conn.execute('pragma quick_check').fetchall()!=[('ok',)]:raise ValueError('SQLite integrity failure: '+str(path))
            tables={r[0] for r in conn.execute("select name from sqlite_master where type='table'")}
            result[str(path.relative_to(root))]={t:conn.execute('select count(*) from "'+t+'"').fetchone()[0] for t in ['sessions','messages'] if t in tables}
        finally:conn.close()
    return result


def rebase_database_paths(root,old,new):
    columns={'cwd','git_repo_root','path','root','project_path','workspace_root','directory','file_path','source_root'}
    for path in root.rglob('*.db'):
        if path.is_symlink():continue
        with path.open('rb') as f:header=f.read(16)
        if header!=b'SQLite format 3\0':continue
        c=sqlite3.connect(path)
        try:
            tables=[r[0] for r in c.execute("select name from sqlite_master where type='table'")]
            for table in tables:
                qt='"'+table.replace('"','""')+'"'
                for col in c.execute('pragma table_info('+qt+')').fetchall():
                    if col[1] not in columns:continue
                    qc='"'+col[1]+'"'
                    c.execute('update '+qt+' set '+qc+'=replace('+qc+',?,?) where '+qc+' like ?', (old,new,old+'/%'))
            c.commit()
        finally:c.close()


def decrypt(folder,keyfile,work):
    manifest=json.loads((folder/'MANIFEST.json').read_text())
    key=keyfile.read_bytes().strip()
    if not re.fullmatch(b'[0-9a-f]{64}',key):raise ValueError('복원 키 형식이 맞지 않습니다.')
    mac=hmac.new(hashlib.sha256(b'hermes-backup-auth-v1\0'+key).digest(),digestmod=hashlib.sha256)
    cipher=work/'payload.enc'
    with cipher.open('wb') as output:
        for part in manifest['parts']:
            name=str(inside(part['name']))
            if '/' in name:raise ValueError('Invalid part name')
            digest=hashlib.sha256();size=0
            with (folder/name).open('rb') as src:
                while True:
                    block=src.read(1024*1024)
                    if not block:break
                    digest.update(block);mac.update(block);size+=len(block);output.write(block)
            if digest.hexdigest()!=part['sha256'] or size!=part['bytes']:raise ValueError('백업 조각이 손상되었습니다: '+name)
    if not hmac.compare_digest(mac.hexdigest(),manifest['ciphertext_hmac_sha256']):raise ValueError('복원 키가 틀렸거나 백업이 변조되었습니다. 복원을 중단합니다.')
    archive=work/'payload.tar'
    run(['/usr/bin/openssl','enc','-d','-aes-256-cbc','-pbkdf2','-iter','600000','-md','sha256','-in',cipher,'-out',archive,'-pass','file:'+str(keyfile)])
    extract_tar(archive,work/'payload')
    return work/'payload'


def main():
    parser=argparse.ArgumentParser(description='헤르메스 설치 후 실행하는 데이터/수정 소스 복원')
    parser.add_argument('--key',type=Path,required=True)
    parser.add_argument('--destination',type=Path,default=Path.home())
    parser.add_argument('--extract-only',action='store_true',help='격리된 검증 폴더로만 추출; 서비스/현재 설치 변경 안 함')
    parser.add_argument('--activate',action='store_true')
    parser.add_argument('--old-server-stopped',action='store_true')
    args=parser.parse_args();folder=Path(__file__).resolve().parent;destination=args.destination.expanduser().resolve()
    if args.activate and not args.old_server_stopped:raise ValueError('기존 맥의 게이트웨이를 중지한 뒤 --old-server-stopped와 함께 실행하세요.')
    if not args.extract_only and destination!=Path.home():raise ValueError('실제 복원은 현재 사용자의 홈에만 가능합니다.')
    hermes=shutil.which('hermes') or str(Path.home()/'.local/bin/hermes')
    if not args.extract_only and not Path(hermes).is_file():raise ValueError('먼저 새 맥에 Hermes를 설치하세요.')
    destination.mkdir(parents=True,exist_ok=True)
    with tempfile.TemporaryDirectory(prefix='hermes-restore-') as tmp:
        work=Path(tmp);payload=decrypt(folder,args.key.expanduser().resolve(),work)
        metadata=json.loads((payload/'migration-metadata.json').read_text());old=metadata['source_home'];new=str(destination)
        if not args.extract_only:
            raw=subprocess.check_output(['ioreg','-rd1','-c','IOPlatformExpertDevice'],text=True)
            if metadata['source_machine_uuid'] in raw:raise ValueError('원본 맥에는 이 이전용 백업을 복원하지 않습니다.')
            if os.uname().machine!=metadata['source_architecture']:raise ValueError('이 백업은 Apple Silicon 맥용입니다.')
        migrated=work/'hermes-home-portable.zip';portable_zip(payload/'hermes-home.zip',migrated,old,new)
        h=destination/'.hermes'
        if args.extract_only:
            if h.exists():raise ValueError('검증 대상은 비어 있는 폴더여야 합니다.')
            h.mkdir(mode=0o700)
            with zipfile.ZipFile(migrated) as z:
                for info in z.infolist():
                    rel=inside(info.filename)
                    if info.is_dir():continue
                    p=h/str(rel);p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(z.read(info));p.chmod(0o600)
        else:
            print('기존 설치의 게이트웨이를 중지하고 복원 전 백업을 만듭니다.',flush=True)
            run([hermes,'--profile','default','gateway','stop','--yes'])
            safety=h/'backups'/('before-migration-'+time.strftime('%Y%m%d-%H%M%S')+'.zip');safety.parent.mkdir(parents=True,exist_ok=True)
            run([hermes,'backup','--keep','0','--output',safety])
            run([hermes,'import',migrated,'--force'])
        source=h/'hermes-agent'
        if source.exists():
            saved=h/'backups'/('source-before-migration-'+time.strftime('%Y%m%d-%H%M%S'));saved.parent.mkdir(parents=True,exist_ok=True);source.rename(saved)
        run(['git','clone','--quiet',payload/'source.bundle',source])
        run(['git','remote','set-url','origin','https://github.com/hushmind3/hermes-desktop-macos.git'],cwd=source)
        for p in source.rglob('*'):
            if '.git' not in p.relative_to(source).parts:rewrite_text(p,old,new)
        for link in json.loads((payload/'home-symlinks.json').read_text()):
            p=h/str(inside(link['path']));target=link['target'].replace(old,new)
            if p.is_symlink():p.unlink()
            elif p.exists():raise ValueError('링크 복원 대상이 일반 파일/폴더입니다: '+str(p))
            p.parent.mkdir(parents=True,exist_ok=True);p.symlink_to(target)
        extras=work/'extras';extract_tar(payload/'mac-settings.tar.gz',extras)
        extra_home=extras/'mac-home'
        if extra_home.exists():
            for p in extra_home.rglob('*'):
                if not p.is_file():continue
                rel=p.relative_to(extra_home)
                if p.name=='secure-token-storage.json':continue # encrypted by old macOS Keychain
                rewrite_text(p,old,new)
                dst=destination/rel;dst.parent.mkdir(parents=True,exist_ok=True)
                # Keep a valid login already created on the destination.
                if str(rel)=='.codex/auth.json' and dst.exists():continue
                shutil.copy2(p,dst)
        for p in h.rglob('*'):
            if p.is_file() and 'hermes-agent' not in p.relative_to(h).parts:rewrite_text(p,old,new)
        rebase_database_paths(h,old,new)
        for p in h.rglob('*'):
            if p.name in {'gateway.pid','gateway_state.json','gateway.lock','processes.json','cron.pid'} or p.name.endswith(('.db-wal','.db-shm')):
                if p.is_file():p.unlink()
        counts=verify_dbs(h)
        print('데이터베이스 검증 완료:',len(counts),'개',flush=True)
        (destination/'hermes-restore-report.json').write_text(json.dumps({'backup_created_at':metadata['created_at'],'models_included':False,'apps_included':False,'databases':counts,'extract_only':args.extract_only},ensure_ascii=False,indent=2))
        if not args.extract_only:
            env={**os.environ,'HERMES_HOME':str(h)}
            print('저장된 소스/잠금 파일에 맞춰 실행 환경을 다시 준비합니다. 인터넷이 필요합니다.',flush=True)
            for stage in ['venv','python-deps','products']:
                command=['bash',source/'scripts/install.sh','--stage',stage,'--non-interactive','--dir',source,'--hermes-home',h]
                if stage=='products':command.append('--include-desktop')
                run(command,env=env)
            hermes=str(destination/'.local/bin/hermes')
            run([hermes,'--profile','default','gateway','install','--force','--no-start-now','--no-start-on-login'],env=env)
            if args.activate:
                run([hermes,'--profile','default','gateway','install','--force','--start-now','--start-on-login'],env=env)
            print('복원 완료. macOS 권한/기기별 로그인은 새 맥에서 승인해야 할 수 있습니다.',flush=True)
            print('기존 맥을 중지한 뒤 새 맥에서 실행: hermes --profile default gateway start',flush=True)
        else:print('격리 복원 검증 완료. 현재 설치와 서비스는 변경하지 않았습니다.',flush=True)

if __name__=='__main__':
    try:main()
    except Exception as exc:
        print('복원 중단:',exc,file=sys.stderr);sys.exit(1)
