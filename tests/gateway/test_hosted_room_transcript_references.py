"""A retained reply must keep its source question available to policy validation."""
from gateway import hosted_room_discussion as discussion, hosted_rooms as rooms
from gateway.hosted_room_policy_checkpoint import HostedRoomPolicyCheckpoint


def test_followups_survive_source_question_crossing_transcript_cutoff(tmp_path):
    db = tmp_path / 'state.db'
    room_id = 'followups'
    profiles = ('writer', 'reviewer')
    room = rooms.create_room(db, room_id=room_id, name='Followups', authority_gateway_id='home',
        members=[{'member_id':p, 'profile':p, 'handle':p} for p in profiles])
    def append_user(event_id):
        return rooms.append_event(db, room_id=room_id, event_id=event_id, kind='message.user',
            actor={'kind':'user','id':'owner'}, authority_gateway_id='home', authority_epoch=1,
            payload={'text':f'@writer {event_id}', 'thread_id':'telegram'})
    append_user('original-question')
    events = rooms.read_events(db, room_id=room_id)['events']
    plan = discussion.plan_next_task(room, events, local_profiles=profiles).task
    publication = discussion.plan_publication(room, events, plan, status='settled',
        result={'text':'Original answer'}, local_profiles=profiles)
    for event in publication.events:
        rooms.append_event(db, **event.append_kwargs(room_id))
    checkpoint = HostedRoomPolicyCheckpoint(db)
    for index in range(30):
        latest = append_user(f'followup-{index}')
        snapshot = checkpoint.snapshot(room_id=room_id, latest_seq=latest['seq'])
        decision = discussion.plan_next_task(room, snapshot.events, local_profiles=profiles,
            initial_watermarks=snapshot.watermarks, freeze_input_context=True)
        assert decision.status == 'task'
        assert decision.source_event_seq == latest['seq']
    assert rooms.read_events(db, room_id=room_id)['cursor'] == latest['seq']
