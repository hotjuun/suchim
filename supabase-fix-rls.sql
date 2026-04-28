-- 스침 RLS (Row Level Security) 정책 수정
-- Supabase Dashboard > SQL Editor 에서 실행하세요

-- 1. posts 테이블: 누구나 읽기 가능, 본인만 쓰기/삭제
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "posts_select_all" ON posts;
CREATE POLICY "posts_select_all" ON posts
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "posts_insert_auth" ON posts;
CREATE POLICY "posts_insert_auth" ON posts
  FOR INSERT WITH CHECK (auth.uid() = user_id::uuid);

DROP POLICY IF EXISTS "posts_delete_own" ON posts;
CREATE POLICY "posts_delete_own" ON posts
  FOR DELETE USING (auth.uid() = user_id::uuid);

-- 2. match_requests 테이블: 관련자만 읽기, 로그인 사용자 쓰기
ALTER TABLE match_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "matches_select_related" ON match_requests;
CREATE POLICY "matches_select_related" ON match_requests
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "matches_insert_auth" ON match_requests;
CREATE POLICY "matches_insert_auth" ON match_requests
  FOR INSERT WITH CHECK (auth.uid() = requester_id::uuid);

DROP POLICY IF EXISTS "matches_update_auth" ON match_requests;
CREATE POLICY "matches_update_auth" ON match_requests
  FOR UPDATE USING (true);

-- 3. chat_rooms 테이블
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "chatrooms_select_all" ON chat_rooms;
CREATE POLICY "chatrooms_select_all" ON chat_rooms
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "chatrooms_insert_auth" ON chat_rooms;
CREATE POLICY "chatrooms_insert_auth" ON chat_rooms
  FOR INSERT WITH CHECK (auth.uid()::text IN (user1_id, user2_id));

-- 4. chat_messages 테이블
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "chatmessages_select_all" ON chat_messages;
CREATE POLICY "chatmessages_select_all" ON chat_messages
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "chatmessages_insert_auth" ON chat_messages;
CREATE POLICY "chatmessages_insert_auth" ON chat_messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id::uuid);
