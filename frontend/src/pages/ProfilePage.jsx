import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "../contexts/AuthContext";
import { useParams } from "react-router-dom";
import { FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useTheme } from "../contexts/ThemeContext";

const dummyStats = {
  translatedChars: 15000,
  docsWritten: 25,
  chatbotInteractions: 150,
  lastActive: "2024-01-04",
};

const ProfilePage = () => {
  const { user, session } = useAuth();
  const { userId } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [publicDocs, setPublicDocs] = useState([]);
  const [alldocs, setAllDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isDark } = useTheme();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        if (userId) {
          // Fetch other user's profile
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/user/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${session?.access_token}`,
              },
            }
          );
          setProfileData(response.data);

          // Fetch user's public documents
          const docsResponse = await axios.get(
            `${import.meta.env.VITE_API_URL}/document/user/${userId}/public`,
            {
              headers: {
                Authorization: `Bearer ${session?.access_token}`,
              },
            }
          );
          setPublicDocs(docsResponse.data);
        } else {
          // Use current user's data
          setProfileData(user);

          // Fetch all documents for current user
          const docsResponse = await axios.get(
            `${import.meta.env.VITE_API_URL}/document/my/all`,
            {
              headers: {
                Authorization: `Bearer ${session?.access_token}`,
              },
            }
          );
          setAllDocs(docsResponse.data);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.access_token) {
      fetchProfileData();
    }
  }, [userId, user, session]);

  if (loading) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center text-gray-500">User not found</div>
      </div>
    );
  }
  console.log(profileData);

  return (
    <div className="container mx-auto p-6">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList
          className={`w-full ${
            isDark
              ? "bg-slate-800 border-slate-700"
              : "bg-white border-gray-200"
          }`}
        >
          <TabsTrigger
            value="profile"
            className={`${
              isDark
                ? "[&[data-state=active]]:bg-slate-700 [&[data-state=active]]:text-gray-200 text-gray-400 hover:text-gray-200"
                : "[&[data-state=active]]:bg-gray-100 [&[data-state=active]]:text-gray-600 text-gray-500 hover:text-gray-600"
            } transition-colors w-full`}
          >
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="dashboard"
            className={`${
              isDark
                ? "[&[data-state=active]]:bg-slate-700 [&[data-state=active]]:text-gray-200 text-gray-400 hover:text-gray-200"
                : "[&[data-state=active]]:bg-gray-100 [&[data-state=active]]:text-gray-900 text-gray-500 hover:text-gray-900"
            } transition-colors w-full`}
          >
            Dashboard
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="space-y-6">
            <Card className={`${isDark ? "bg-slate-800" : "bg-white"}`}>
              <CardContent className="space-y-6 pt-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage
                      src={
                        profileData.picture ||
                        profileData?.user_metadata?.avatar_url
                      }
                    />
                    <AvatarFallback>
                      {(
                        profileData.name?.[0] ||
                        profileData?.user_metadata?.name?.[0] ||
                        "U"
                      ).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2
                      className={`text-2xl font-bold ${
                        isDark ? "text-gray-200" : "text-gray-900"
                      }`}
                    >
                      {profileData.name ||
                        profileData?.user_metadata?.full_name}
                    </h2>
                    <p className={isDark ? "text-gray-400" : "text-gray-500"}>
                      {profileData.email}
                    </p>
                    <p
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Member since:{" "}
                      {new Date(profileData.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {!userId && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p
                        className={`text-sm font-medium ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Provider
                      </p>
                      <p
                        className={`capitalize ${
                          isDark ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {profileData?.app_metadata?.provider}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p
                        className={`text-sm font-medium ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Role
                      </p>
                      <p
                        className={`capitalize ${
                          isDark ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {profileData?.user_metadata?.role}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p
                        className={`text-sm font-medium ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Last Sign In
                      </p>
                      <p className={isDark ? "text-gray-300" : "text-gray-600"}>
                        {new Date(
                          profileData?.last_sign_in_at
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}

                {userId && publicDocs.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-4">My Documents</h3>
                    <div className="grid gap-4">
                      {publicDocs.map((doc) => (
                        <div
                          key={doc.id}
                          className={`p-4 rounded-lg border bg-card hover:bg-accent transition-colors cursor-pointer flex items-center space-x-3 ${
                            isDark ? "text-gray-300" : "text-gray-600"
                          }`}
                          onClick={() => navigate(`/editor/${doc.id}`)}
                        >
                          <FileText className="w-5 h-5 text-blue-500" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">{doc.title}</h4>
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  doc.is_public
                                    ? isDark
                                      ? "bg-green-500/20 text-green-300"
                                      : "bg-green-100 text-green-800"
                                    : isDark
                                    ? "bg-yellow-500/20 text-yellow-300"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {doc.is_public ? "Public" : "Private"}
                              </span>
                            </div>
                            <p
                              className={`text-sm ${
                                isDark ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              Created:{" "}
                              {new Date(doc.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {!userId && (
              <div className="mt-8">
                <h3 className="text-2xl font-bold mb-4">My Documents</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {alldocs.map((doc) => (
                    <div
                      key={doc.id}
                      className={`p-4 rounded-lg border bg-gradient-to-tr from-slate-800 to-slate-500 hover:from-green-500 hover:to-slate-500 transition-colors cursor-pointer flex items-center space-x-3 ${
                        isDark ? "text-gray-300" : "text-gray-600"
                      }`}
                      onClick={() => navigate(`/editor/${doc.id}`)}
                    >
                      <FileText className="w-5 h-5 text-blue-500" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{doc.title}</h4>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              doc.is_public
                                ? isDark
                                  ? "bg-green-500/20 text-green-300"
                                  : "bg-green-100 text-green-800"
                                : isDark
                                ? "bg-yellow-500/20 text-yellow-300"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {doc.is_public ? "Public" : "Private"}
                          </span>
                        </div>
                        <p
                          className={`text-sm ${
                            isDark ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Created:{" "}
                          {new Date(doc.upload_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="dashboard">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-6">Activity Dashboard</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-secondary rounded-lg">
                  <h3 className="text-lg font-medium mb-2">
                    Characters Translated
                  </h3>
                  <p className="text-3xl font-bold">
                    {dummyStats.translatedChars.toLocaleString()}
                  </p>
                </div>
                <div className="p-4 bg-secondary rounded-lg">
                  <h3 className="text-lg font-medium mb-2">
                    Documents Written
                  </h3>
                  <p className="text-3xl font-bold">{publicDocs.length}</p>
                </div>
                <div className="p-4 bg-secondary rounded-lg">
                  <h3 className="text-lg font-medium mb-2">
                    Chatbot Interactions
                  </h3>
                  <p className="text-3xl font-bold">
                    {dummyStats.chatbotInteractions}
                  </p>
                </div>
                <div className="p-4 bg-secondary rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Last Active</h3>
                  <p className="text-3xl font-bold">
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
