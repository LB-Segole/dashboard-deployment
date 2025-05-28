import { User, Mail, Phone, Settings, Loader2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../hooks/useAuth';

export const Profile = () => {
  const { state: { user }, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: '+1 (555) 123-4567', // Mock phone number
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          <Card className="p-6">
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="h-12 w-12 text-blue-600" />
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md border border-gray-200">
                    <Settings className="h-4 w-4 text-gray-600" />
                  </button>
                )}
              </div>
              <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
              <div className="mt-6 w-full">
                <Button
                  onClick={isEditing ? handleSave : () => setIsEditing(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : isEditing ? (
                    'Save Changes'
                  ) : (
                    'Edit Profile'
                  )}
                </Button>
                {!isEditing && (
                  <Button
                    onClick={logout}
                    variant="outline"
                    className="w-full mt-2"
                  >
                    Sign Out
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>

        <div className="md:w-2/3">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Profile Information</h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                {isEditing ? (
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="flex items-center p-2 bg-gray-50 rounded-md">
                    <User className="h-5 w-5 text-gray-400 mr-2" />
                    <span>{formData.name}</span>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                {isEditing ? (
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="flex items-center p-2 bg-gray-50 rounded-md">
                    <Mail className="h-5 w-5 text-gray-400 mr-2" />
                    <span>{formData.email}</span>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                {isEditing ? (
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="flex items-center p-2 bg-gray-50 rounded-md">
                    <Phone className="h-5 w-5 text-gray-400 mr-2" />
                    <span>{formData.phone}</span>
                  </div>
                )}
              </div>

              {isEditing && (
                <div className="pt-4">
                  <Button
                    onClick={() => setIsEditing(false)}
                    variant="outline"
                    className="mr-2"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};