"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProcurementCalculatorProps {
  estimatedGsm: number;
}

export function ProcurementCalculator({ estimatedGsm }: ProcurementCalculatorProps) {
  const [yards, setYards] = useState("500");
  const [widthInches, setWidthInches] = useState("58");

  const yardsNum = parseFloat(yards) || 0;
  const widthNum = parseFloat(widthInches) || 58;

  const areaM2 = yardsNum * 0.9144 * (widthNum * 0.0254);
  const totalWeightKg = (areaM2 * estimatedGsm) / 1000;
  const totalWeightLbs = totalWeightKg * 2.20462;

  return (
    <Card className="interactive-card print:hidden">
      <CardHeader>
        <CardTitle>Bulk Order Calculator</CardTitle>
        <CardDescription>
          Estimate fabric weight for logistics and procurement costing (based on {estimatedGsm} g/m²)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="yards">Quantity (yards)</Label>
            <Input
              id="yards"
              type="number"
              min="1"
              value={yards}
              onChange={(e) => setYards(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="width">Fabric Width (inches)</Label>
            <Input
              id="width"
              type="number"
              min="1"
              value={widthInches}
              onChange={(e) => setWidthInches(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-2 border-t">
          <div>
            <p className="text-xs text-muted-foreground">Total Area</p>
            <p className="text-lg font-bold">{areaM2.toFixed(1)} m²</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Est. Weight</p>
            <p className="text-lg font-bold">{totalWeightKg.toFixed(1)} kg</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Est. Weight</p>
            <p className="text-lg font-bold">{totalWeightLbs.toFixed(0)} lbs</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Use this for freight quotes, MOQ planning, and cost-per-kg negotiations with suppliers.
        </p>
      </CardContent>
    </Card>
  );
}
