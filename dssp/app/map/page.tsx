import Worldmap from '@/components/Worldmap/page';
import { createClient } from '@/utils/supabase/server';
import Nav from '@/components/nav/Nav';
import styles from '@/components/Worldmap/worldmap.module.css';

export default async function Map() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className={styles.page}>
      <Nav />
      <main className={styles.main}>
        <Worldmap authorized={user} />
      </main>
    </div>
  );
}
