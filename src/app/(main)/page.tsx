
import { getCtfsFromDB } from '@/lib/data';
// Make sure the file exists at the correct path and with the correct name and extension.
// For example, if the file is named 'home-client.tsx', use:
import HomePageClient from './home-client';
// If the file is named differently (e.g., 'HomeClient.tsx'), update the import:
 // import HomePageClient from './HomeClient';

export default async function HomePage() {
  const ctfs = await getCtfsFromDB();

  return <HomePageClient ctfs={ctfs} />;
}
