'use client';

import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Languages } from "lucide-react";
import { Label } from "@/components/ui/label";
import { ProcessingStatus } from 'streameth-new-server/src/interfaces/session.interface';
import { startSessionTranslation } from '@/lib/services/sessionService';

interface TranslationPanelProps {
  sessionId: string;
  organizationId: string;
  translations?: {
    [language: string]: {
      status: ProcessingStatus;
      assetId?: string;
      text?: string;
    };
  };
}

const languages = [
  { code: 'es', name: 'Spanish' },
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'zh', name: 'Chinese' }
];

export function TranslationPanel({ sessionId, organizationId, translations = {} }: TranslationPanelProps) {
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

  const handleTranslate = async () => {
    if (!selectedLanguage) return;
    
    try {
      setIsTranslating(true);
      await startSessionTranslation({
        sessionId,
        language: selectedLanguage,
        organizationId
      });
    } catch (error) {
      console.error('Translation failed:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  const getBadgeVariant = (status: ProcessingStatus) => {
    switch (status) {
      case ProcessingStatus.completed:
        return "default" as const;
      case ProcessingStatus.failed:
        return "destructive" as const;
      default:
        return "secondary" as const;
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <Label>Translations</Label>
      <div className="flex items-center gap-2">
        <Select
          value={selectedLanguage}
          onValueChange={setSelectedLanguage}
          disabled={isTranslating}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Language" />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={lang.code} value={lang.code}>
                {lang.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button
          onClick={handleTranslate}
          disabled={!selectedLanguage || isTranslating}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Languages className="h-4 w-4" />
          {isTranslating ? 'Translating...' : 'Translate'}
        </Button>
      </div>

      {/* Show existing translations */}
      {Object.entries(translations).length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {Object.entries(translations).map(([lang, data]) => (
            <Badge 
              key={lang} 
              variant={getBadgeVariant(data.status)}
              className="flex items-center gap-1.5"
            >
              {languages.find(l => l.code === lang)?.name || lang}
              <span className="text-xs opacity-70">•</span>
              <span className="text-xs">{data.status}</span>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}   