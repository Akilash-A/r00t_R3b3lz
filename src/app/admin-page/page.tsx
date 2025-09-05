
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { getCtfsFromDB, getChallengesFromDB, getTeamMembersFromDB } from "@/lib/data";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Users, Flag } from "lucide-react";

export default async function AdminDashboardPage() {
  // Fetch real data from database
  let ctfs, challenges, teamMembers;
  
  try {
    [ctfs, challenges, teamMembers] = await Promise.all([
      getCtfsFromDB(),
      getChallengesFromDB(),
      getTeamMembersFromDB()
    ]);
  } catch (error) {
    console.error('Dashboard data fetch error:', error);
    // Fallback to empty arrays if database fetch fails
    ctfs = [];
    challenges = [];
    teamMembers = [];
  }

  // Calculate additional stats
  const totalCategories = challenges.length > 0 ? 
    new Set(challenges.map(c => c.category)).size : 0;
  const recentChallenges = challenges.length;
  const activeCTFs = ctfs.length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to the r00t R3b3lz Admin Panel. Manage your CTF events, writeups, and team members.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total CTF Events</CardTitle>
            <Flag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCTFs}</div>
            <p className="text-xs text-muted-foreground">
              {activeCTFs === 0 ? 'No events yet' : `${activeCTFs} event${activeCTFs !== 1 ? 's' : ''} managed`}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Write-ups</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentChallenges}</div>
            <p className="text-xs text-muted-foreground">
              {recentChallenges === 0 ? 'No writeups yet' : 
               totalCategories > 0 ? `${totalCategories} categor${totalCategories !== 1 ? 'ies' : 'y'} covered` : 
               `Across ${activeCTFs} CTF${activeCTFs !== 1 ? 's' : ''}`}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamMembers.length}</div>
            <p className="text-xs text-muted-foreground">
              {teamMembers.length === 0 ? 'No members added' : `${teamMembers.length} member${teamMembers.length !== 1 ? 's' : ''} in the team`}
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
           <Button asChild>
             <Link href="/admin-page/ctfs">Manage CTF Events <ArrowRight className="ml-2 h-4 w-4" /></Link>
           </Button>
           <Button asChild>
             <Link href="/admin-page/writeups">Manage Write-ups <ArrowRight className="ml-2 h-4 w-4" /></Link>
           </Button>
           <Button asChild>
             <Link href="/admin-page/members">Manage Members <ArrowRight className="ml-2 h-4 w-4" /></Link>
           </Button>
        </div>
      </div>
    </div>
  );
}
