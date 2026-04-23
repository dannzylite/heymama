import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import { Navigation } from "@/components/layout/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import type { Profile } from "@/lib/supabase";
import {
  User,
  Bell,
  Heart,
  Baby,
  Calendar,
  Phone,
  Activity,
  Edit,
  AlertTriangle,
  Plus,
  Loader2,
  MapPin,
  Droplets,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const emptyProfile: Omit<Profile, "id" | "updated_at"> = {
  full_name: "",
  phone: "",
  age: null,
  pregnancy_week: null,
  due_date: null,
  location: "",
  blood_type: "",
  allergies: "None",
  previous_pregnancies: 0,
  emergency_contact_name: "",
  emergency_contact_phone: "",
};

export default function Profile() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Omit<Profile, "id" | "updated_at">>(emptyProfile);

  const [notifications, setNotifications] = useState({
    bpReminders: true,
    medicationAlerts: true,
    appointmentReminders: true,
    emergencyAlerts: true,
    weeklyReports: true,
  });

  // Load profile from Supabase
  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()
      .then(({ data }: { data: Profile | null }) => {
        if (data) {
          const { id: _id, updated_at: _ts, ...rest } = data;
          setProfile({ ...emptyProfile, ...rest });
        }
        setLoading(false);
      });
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    const { error } = await supabase
      .from("profiles")
      .upsert({ id: user.id, ...profile, updated_at: new Date().toISOString() });

    if (error) {
      toast({ title: "Error saving profile", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Profile Updated", description: "Your profile has been saved successfully." });
      setIsEditing(false);
    }
    setSaving(false);
  };

  const set = (field: keyof typeof emptyProfile, value: string | number | null) =>
    setProfile((prev) => ({ ...prev, [field]: value }));

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [key]: value }));
  };

  const initials = profile.full_name
    ? profile.full_name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() ?? "?";

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container px-4 py-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">My Profile</h1>
            <p className="text-muted-foreground">Manage your health information and preferences</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">

            {/* Personal Information */}
            <Card className="shadow-card bg-gradient-card animate-scale-in">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-primary" />
                    <span>Personal Information</span>
                  </CardTitle>
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                    <Edit className="h-4 w-4 mr-2" />
                    {isEditing ? "Cancel" : "Edit"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Avatar */}
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center text-2xl font-bold text-white">
                    {initials}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{profile.full_name || user?.email}</h3>
                    {profile.pregnancy_week && (
                      <p className="text-muted-foreground">{profile.pregnancy_week} weeks pregnant</p>
                    )}
                    {profile.due_date && (
                      <Badge className="bg-secondary text-secondary-foreground mt-1">
                        <Baby className="h-3 w-3 mr-1" />
                        Due: {profile.due_date}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <Input
                      value={profile.full_name ?? ""}
                      disabled={!isEditing}
                      onChange={(e) => set("full_name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Age</label>
                    <Input
                      type="number"
                      value={profile.age ?? ""}
                      disabled={!isEditing}
                      onChange={(e) => set("age", e.target.value ? parseInt(e.target.value) : null)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input value={user?.email ?? ""} disabled />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone</label>
                    <Input
                      value={profile.phone ?? ""}
                      disabled={!isEditing}
                      onChange={(e) => set("phone", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Location</label>
                    <Input
                      value={profile.location ?? ""}
                      disabled={!isEditing}
                      placeholder="City, Country"
                      onChange={(e) => set("location", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Blood Type</label>
                    <Input
                      value={profile.blood_type ?? ""}
                      disabled={!isEditing}
                      placeholder="e.g. O+"
                      onChange={(e) => set("blood_type", e.target.value)}
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end pt-4">
                    <Button onClick={handleSave} disabled={saving} className="bg-gradient-primary">
                      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Medical Information */}
            <Card className="shadow-card bg-gradient-card animate-scale-in">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Heart className="h-5 w-5 text-primary" />
                    <span>Medical Information</span>
                  </CardTitle>
                  {!isEditing && (
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-1">
                      <Baby className="h-4 w-4 text-muted-foreground" /> Pregnancy Week
                    </label>
                    <Input
                      type="number"
                      value={profile.pregnancy_week ?? ""}
                      disabled={!isEditing}
                      placeholder="e.g. 28"
                      onChange={(e) => set("pregnancy_week", e.target.value ? parseInt(e.target.value) : null)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" /> Due Date
                    </label>
                    <Input
                      type="date"
                      value={profile.due_date ?? ""}
                      disabled={!isEditing}
                      onChange={(e) => set("due_date", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-1">
                      <Activity className="h-4 w-4 text-muted-foreground" /> Previous Pregnancies
                    </label>
                    <Input
                      type="number"
                      value={profile.previous_pregnancies ?? 0}
                      disabled={!isEditing}
                      onChange={(e) => set("previous_pregnancies", parseInt(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-1">
                      <Droplets className="h-4 w-4 text-muted-foreground" /> Allergies
                    </label>
                    <Input
                      value={profile.allergies ?? "None"}
                      disabled={!isEditing}
                      placeholder="None"
                      onChange={(e) => set("allergies", e.target.value)}
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end pt-4">
                    <Button onClick={handleSave} disabled={saving} className="bg-gradient-primary">
                      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Emergency Contacts */}
            <Card className="shadow-card bg-gradient-card animate-scale-in">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Phone className="h-5 w-5 text-destructive" />
                  <span>Emergency Contact</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Contact Name</label>
                    <Input
                      value={profile.emergency_contact_name ?? ""}
                      disabled={!isEditing}
                      placeholder="e.g. Dr. Aduke"
                      onChange={(e) => set("emergency_contact_name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Contact Phone</label>
                    <Input
                      value={profile.emergency_contact_phone ?? ""}
                      disabled={!isEditing}
                      placeholder="+234 800 000 0000"
                      onChange={(e) => set("emergency_contact_phone", e.target.value)}
                    />
                  </div>
                </div>

                {profile.emergency_contact_name && (
                  <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">{profile.emergency_contact_name}</p>
                        <p className="text-sm text-muted-foreground">{profile.emergency_contact_phone}</p>
                      </div>
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                    </div>
                  </div>
                )}

                {isEditing && (
                  <div className="flex justify-end">
                    <Button onClick={handleSave} disabled={saving} className="bg-gradient-primary">
                      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
                    </Button>
                  </div>
                )}

                {!isEditing && (
                  <Button variant="outline" className="w-full" onClick={() => setIsEditing(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    {profile.emergency_contact_name ? "Update Contact" : "Add Emergency Contact"}
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile summary */}
            <Card className="shadow-card bg-gradient-card animate-scale-in">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-primary" />
                  <span>Account Info</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-medium truncate max-w-[150px]">{user?.email}</span>
                </div>
                {profile.phone && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone</span>
                    <span className="font-medium">{profile.phone}</span>
                  </div>
                )}
                {profile.location && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> Location
                    </span>
                    <span className="font-medium">{profile.location}</span>
                  </div>
                )}
                {profile.blood_type && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Blood Type</span>
                    <Badge variant="outline">{profile.blood_type}</Badge>
                  </div>
                )}
                {profile.pregnancy_week && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pregnancy</span>
                    <span className="font-medium">Week {profile.pregnancy_week}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card className="shadow-card bg-gradient-card animate-scale-in">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-primary" />
                  <span>Notifications</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <label className="text-sm font-medium capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </label>
                    <Switch
                      checked={value}
                      onCheckedChange={(checked) => handleNotificationChange(key, checked)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
