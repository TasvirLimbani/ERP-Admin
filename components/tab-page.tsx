'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface TabPageProps {
  inputTab: {
    title: string
    form: React.ReactNode
    table: React.ReactNode
  }
  outputTab: {
    title: string
    form: React.ReactNode
    table: React.ReactNode
  }
}

export function TabPage({ inputTab, outputTab }: TabPageProps) {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
          Management
        </h1>
      </div>

      <Tabs defaultValue="input" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="input">{inputTab.title}</TabsTrigger>
          <TabsTrigger value="output">{outputTab.title}</TabsTrigger>
        </TabsList>

        <TabsContent value="input" className="space-y-6">
          {inputTab.form}
          {inputTab.table}
        </TabsContent>

        <TabsContent value="output" className="space-y-6">
          {outputTab.form}
          {outputTab.table}
        </TabsContent>
      </Tabs>
    </div>
  )
}
