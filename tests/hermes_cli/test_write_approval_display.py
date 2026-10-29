import copy
import pytest
from hermes_cli import write_approval_display as display


@pytest.fixture(autouse=True)
def korean(monkeypatch, tmp_path):
    from agent import i18n
    monkeypatch.setattr(i18n, 'get_language', lambda:'ko')
    monkeypatch.setenv('HERMES_HOME',str(tmp_path))
    display._cached_translation.cache_clear()


def test_pending_contains_exact_proposal_without_applying_and_is_cached(monkeypatch):
    from tools import write_approval as wa
    records=[{'id':'aabb0011','payload':{'action':'patch','old_text':'only when called',
        'content':'respond to human messages','matched_entry':'Only when called; retain Korean persona.'}}]
    before=copy.deepcopy(records)
    monkeypatch.setattr(wa,'list_pending',lambda _:records)
    calls=[]
    def translate(source):
        calls.append(source)
        assert 'respond to human messages' in source
        assert 'Only when called; retain Korean persona.' in source
        return 'aabb0011: 기존 호출 제한 구간을 사람 메시지에 응답하도록 수정. 나머지 문장은 유지.'
    monkeypatch.setattr(display,'_translate',translate)
    text=display.korean_review_output('Pending memory writes (1): aabb0011','memory',['pending'])
    assert '한국어 표시' in text and '원문 (대조용)' in text
    assert records==before
    display.korean_review_output('Pending memory writes (1): aabb0011','memory',['pending'])
    assert len(calls)==1


def test_translation_failure_is_explicit_and_preserves_original(monkeypatch):
    monkeypatch.setattr(display,'_translate',lambda _:(_ for _ in ()).throw(TimeoutError()))
    out=display.korean_review_output('Failed: original error','memory',['approve','x'])
    assert '번역을 완료하지 못했습니다' in out
    assert 'Failed: original error' in out


@pytest.mark.parametrize(('original','expected'),[
 ('No pending memory writes.','승인 대기 중인 기억 변경이 없습니다.'),
 ('Approved 2 memory write(s).','기억 변경 2건 승인·적용 완료.'),
 ('Rejected 3 pending skills write(s).','스킬 변경 3건 거절 완료.')])
def test_simple_results_do_not_call_model(monkeypatch,original,expected):
    monkeypatch.setattr(display,'_translate',lambda _:pytest.fail('unneeded model call'))
    subsystem='skills' if 'skills' in original else 'memory'
    assert display.korean_review_output(original,subsystem,['approve','all'])==expected


def test_other_language_is_unchanged(monkeypatch):
    from agent import i18n
    monkeypatch.setattr(i18n,'get_language',lambda:'en')
    assert display.korean_review_output('original','memory',['pending'])=='original'


def test_translation_rejects_truncated_model_result(monkeypatch):
    from agent import auxiliary_client
    monkeypatch.setattr(auxiliary_client,'call_llm',lambda **kwargs:{'choices':[
        {'finish_reason':'length','message':{'content':'일부만 번역'}}]})
    with pytest.raises(ValueError,match='truncated'):
        display._translate('Full proposal with essential final condition')
