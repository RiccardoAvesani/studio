
"use client";

import React from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import useConfig from "@/hooks/use-config";
import {useForm} from "react-hook-form";
import { cn } from "@/lib/utils";
import {Language} from "@/types";

const ConfigPage: React.FC = () => {
  const {config, updateConfig} = useConfig();
    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { isDirty, isValid },
    } = useForm({
        defaultValues: config,
        mode: "onChange"
    });

    const language = watch("language");

  const onSubmit = (data: any) => {
      updateConfig({
          url: data.url,
          apiKey: data.apiKey,
          language: data.language,
      });
      reset(data);
  };

  return (
    <div className="container py-10">
      <Card>
        <CardHeader>
          <CardTitle>Moodle API Configuration</CardTitle>
          <CardDescription>
            Configure the Moodle API URL, API Key, and application language.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="url">Moodle API URL</Label>
              <Input
                id="url"
                defaultValue={config.url}
                {...register("url")}
                placeholder="https://yourmoodleserver.com/webservice/rest/server.php"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="apiKey">Moodle API Key</Label>
              <Input
                id="apiKey"
                defaultValue={config.apiKey}
                {...register("apiKey")}
                placeholder="Your Moodle API Key"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="language">Application Language</Label>
              <Select
                defaultValue={config.language}
                onValueChange={(value) => {
                    reset({...config, language: value})
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a language"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="it">Italiano</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                  <SelectItem value="ja">Japanese</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={!isDirty || !isValid} className={cn("w-32", !isDirty || !isValid ? "cursor-not-allowed opacity-50" : "")}>Save Configuration</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfigPage;
