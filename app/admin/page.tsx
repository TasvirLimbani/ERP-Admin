"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Users,
  Zap,
  Layers,
  Database,
  TrendingUp,
  AlertCircle,
} from "lucide-react"

export default function DashboardPage() {
  const stats = [
    {
      label: "Total Managers",
      value: "24",
      icon: Users,
      trend: "+4 this month",
      color: "from-blue-500 to-blue-600",
    },
    {
      label: "Active Machines",
      value: "18",
      icon: Zap,
      trend: "+2 this month",
      color: "from-purple-500 to-purple-600",
    },
    {
      label: "Yarn Types",
      value: "156",
      icon: Layers,
      trend: "+12 this month",
      color: "from-cyan-500 to-cyan-600",
    },
    {
      label: "Stock Items",
      value: "1,248",
      icon: Database,
      trend: "+48 this month",
      color: "from-green-500 to-green-600",
    },
  ]

  const recentActivity = [
    {
      id: 1,
      action: "Manager Added",
      detail: "John Smith (ID: MGR-001)",
      time: "2 hours ago",
    },
    {
      id: 2,
      action: "Machine Maintenance",
      detail: "Machine M-12 scheduled maintenance",
      time: "5 hours ago",
    },
    {
      id: 3,
      action: "Stock Updated",
      detail: "Yarn inventory updated for lot YRN-2024-01",
      time: "1 day ago",
    },
    {
      id: 4,
      action: "Dyeing Completed",
      detail: "Batch DYE-324 completed processing",
      time: "2 days ago",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome to your inventory management system
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card
              key={stat.label}
              className="p-6 hover:shadow-lg transition-shadow hover:border-accent/50"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <p className="text-muted-foreground text-sm mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-foreground mb-2">
                {stat.value}
              </p>
              <p className="text-xs text-green-500">{stat.trend}</p>
            </Card>
          )
        })}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">
              Recent Activity
            </h2>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </div>

          <div className="space-y-4">
            {recentActivity.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-4 pb-4 border-b border-border last:border-0 last:pb-0"
              >
                <div className="p-2 rounded-lg bg-secondary">
                  <AlertCircle className="w-4 h-4 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {item.action}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {item.detail}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground whitespace-nowrap">
                  {item.time}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Quick Actions
          </h2>

          <div className="space-y-3">
            <Button
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              size="sm"
            >
              Add New Manager
            </Button>
            <Button
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
              size="sm"
            >
              Add New Machine
            </Button>
            <Button
              variant="outline"
              className="w-full border-border text-foreground hover:bg-secondary"
              size="sm"
            >
              View Reports
            </Button>
            <Button
              variant="outline"
              className="w-full border-border text-foreground hover:bg-secondary"
              size="sm"
            >
              Export Data
            </Button>
          </div>

          {/* System Status */}
          <div className="mt-6 pt-6 border-t border-border">
            <h3 className="text-sm font-medium text-foreground mb-3">
              System Status
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-muted-foreground">
                  All systems operational
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-muted-foreground">
                  Database connected
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
