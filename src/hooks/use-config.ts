
import {useState, useEffect, useCallback} from 'react';
import {toast} from "@/hooks/use-toast";
import {Language} from "@/types";

interface Config {
  id: number;
  url: string;
  apiKey: string;
  language: Language;
  lastModification: string;
}

const initialConfig: Config = {
  id: 1,
  url: '',
  apiKey: '',
  language: 'en',
  lastModification: new Date().toISOString(),
};

const useConfig = () => {
  const [config, setConfig] = useState<Config>(initialConfig);

  useEffect(() => {
    // Load config from localStorage on component mount
    const storedConfig = localStorage.getItem('config');
    if (storedConfig) {
      setConfig(JSON.parse(storedConfig));
    } else {
      localStorage.setItem('config', JSON.stringify(initialConfig));
      setConfig(initialConfig);
    }
  }, []);

  const updateConfig = useCallback((newConfig: Omit<Config, 'id' | 'lastModification'>) => {
    const updatedConfig = {
      ...config,
      ...newConfig,
      lastModification: new Date().toISOString(),
    };

    localStorage.setItem('config', JSON.stringify(updatedConfig));
    setConfig(updatedConfig);
    toast({
      title: "Configuration updated",
      description: "Your configuration has been successfully updated.",
    })
  }, [config]);

  return {config, updateConfig};
};

export default useConfig;
