
import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Settings, Save, Palette } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface AppSettings {
  app_name: string;
  app_description: string;
  support_phone: string;
  support_email: string;
  default_currency: string;
  maintenance_mode: boolean;
  primary_color: string;
  secondary_color: string;
  logo_url: string;
  terms_url: string;
  privacy_url: string;
  facebook_url: string;
  twitter_url: string;
  instagram_url: string;
}

interface SettingsTabProps {
  appSettings: AppSettings;
  setAppSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
}

const SettingsTab = ({ appSettings, setAppSettings }: SettingsTabProps) => {
  const saveSettingsMutation = useMutation({
    mutationFn: async (settings: AppSettings) => {
      localStorage.setItem('app_settings', JSON.stringify(settings));
      
      for (const [key, value] of Object.entries(settings)) {
        await supabase
          .from('admin_settings')
          .upsert({ 
            key, 
            value: typeof value === 'string' ? value : JSON.stringify(value) 
          }, { onConflict: 'key' });
      }
      
      return settings;
    },
    onSuccess: () => {
      toast({ 
        title: 'تم حفظ الإعدادات بنجاح',
        duration: 1000
      });
    }
  });

  const handleSaveSettings = () => {
    saveSettingsMutation.mutate(appSettings);
  };

  return (
    <div className="space-y-6">
      {/* App Settings */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 ml-2" />
            إعدادات التطبيق الأساسية
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="appName">اسم التطبيق</Label>
              <Input
                id="appName"
                value={appSettings.app_name}
                onChange={(e) => setAppSettings(prev => ({ ...prev, app_name: e.target.value }))}
                className="text-right"
              />
            </div>
            <div>
              <Label htmlFor="defaultCurrency">العملة الافتراضية</Label>
              <Input
                id="defaultCurrency"
                value={appSettings.default_currency}
                onChange={(e) => setAppSettings(prev => ({ ...prev, default_currency: e.target.value }))}
                className="text-right"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="appDescription">وصف التطبيق</Label>
            <Textarea
              id="appDescription"
              value={appSettings.app_description}
              onChange={(e) => setAppSettings(prev => ({ ...prev, app_description: e.target.value }))}
              className="text-right"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="supportPhone">رقم الدعم الفني</Label>
              <Input
                id="supportPhone"
                value={appSettings.support_phone}
                onChange={(e) => setAppSettings(prev => ({ ...prev, support_phone: e.target.value }))}
                className="text-right"
              />
            </div>
            <div>
              <Label htmlFor="supportEmail">بريد الدعم الفني</Label>
              <Input
                id="supportEmail"
                value={appSettings.support_email}
                onChange={(e) => setAppSettings(prev => ({ ...prev, support_email: e.target.value }))}
                className="text-right"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 space-x-reverse">
            <input
              type="checkbox"
              id="maintenanceMode"
              checked={appSettings.maintenance_mode}
              onChange={(e) => setAppSettings(prev => ({ ...prev, maintenance_mode: e.target.checked }))}
            />
            <Label htmlFor="maintenanceMode">وضع الصيانة (إيقاف التطبيق مؤقتاً)</Label>
          </div>
        </CardContent>
      </Card>

      {/* Design Settings */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Palette className="h-5 w-5 ml-2" />
            تخصيص التصميم والألوان
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="primaryColor">اللون الأساسي</Label>
              <Input
                id="primaryColor"
                type="color"
                value={appSettings.primary_color}
                onChange={(e) => setAppSettings(prev => ({ ...prev, primary_color: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="secondaryColor">اللون الثانوي</Label>
              <Input
                id="secondaryColor"
                type="color"
                value={appSettings.secondary_color}
                onChange={(e) => setAppSettings(prev => ({ ...prev, secondary_color: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="logoUrl">رابط الشعار</Label>
            <Input
              id="logoUrl"
              value={appSettings.logo_url}
              onChange={(e) => setAppSettings(prev => ({ ...prev, logo_url: e.target.value }))}
              placeholder="https://example.com/logo.png"
              className="text-right"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="facebookUrl">رابط فيسبوك</Label>
              <Input
                id="facebookUrl"
                value={appSettings.facebook_url}
                onChange={(e) => setAppSettings(prev => ({ ...prev, facebook_url: e.target.value }))}
                className="text-right"
              />
            </div>
            <div>
              <Label htmlFor="twitterUrl">رابط تويتر</Label>
              <Input
                id="twitterUrl"
                value={appSettings.twitter_url}
                onChange={(e) => setAppSettings(prev => ({ ...prev, twitter_url: e.target.value }))}
                className="text-right"
              />
            </div>
            <div>
              <Label htmlFor="instagramUrl">رابط إنستجرام</Label>
              <Input
                id="instagramUrl"
                value={appSettings.instagram_url}
                onChange={(e) => setAppSettings(prev => ({ ...prev, instagram_url: e.target.value }))}
                className="text-right"
              />
            </div>
          </div>

          <Button 
            onClick={handleSaveSettings}
            disabled={saveSettingsMutation.isPending}
            className="w-full md:w-auto"
          >
            <Save className="h-4 w-4 ml-2" />
            {saveSettingsMutation.isPending ? 'جاري الحفظ...' : 'حفظ جميع الإعدادات'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsTab;
