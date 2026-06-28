"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const uploadData = [
  { name: "Jan", uploads: 120 },
  { name: "Feb", uploads: 210 },
  { name: "Mar", uploads: 350 },
  { name: "Apr", uploads: 480 },
  { name: "May", uploads: 600 },
  { name: "Jun", uploads: 950 },
];

const userData = [
  { name: "Jan", users: 50 },
  { name: "Feb", users: 120 },
  { name: "Mar", users: 250 },
  { name: "Apr", users: 400 },
  { name: "May", users: 650 },
  { name: "Jun", users: 1100 },
];

export function AdminCharts() {
  return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="interactive-card">
          <CardHeader>
            <CardTitle>User Growth (YTD)</CardTitle>
            <CardDescription>New account registrations over the last 6 months.</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    background: "var(--card)",
                    color: "var(--foreground)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="var(--chart-1)"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="interactive-card">
          <CardHeader>
            <CardTitle>Analysis Volume</CardTitle>
            <CardDescription>Total fabric images uploaded for AI analysis.</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={uploadData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    background: "var(--card)",
                    color: "var(--foreground)",
                  }}
                  cursor={{ fill: "var(--muted)" }}
                />
                <Bar dataKey="uploads" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
  );
}
