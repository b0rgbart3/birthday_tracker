import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface BirthdayFormProps {
  onAdd: () => void;
}

export const BirthdayForm: React.FC<BirthdayFormProps> = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !date) return;
    setIsSubmitting(true);
    setStatus('idle');

    try {
      const response = await fetch('http://localhost:5001/api/birthdays', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, date }),
      });

      if (response.ok) {
        setName('');
        setDate('');
        setStatus('success');
        onAdd();
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Error adding birthday:', error);
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mb-8 bg-slate-900 border-blue-500/50 shadow-lg shadow-blue-500/10">
      <CardHeader>
        <CardTitle className="text-white">Add New Birthday</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-blue-200">Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-slate-800 border-slate-700 text-white focus:border-blue-400 focus:ring-blue-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date" className="text-blue-200">Date of Birth</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-slate-800 border-slate-700 text-white focus:border-blue-400 focus:ring-blue-400"
            />
          </div>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className={`w-full text-white shadow-md transition-all duration-300 ${
              status === 'success' 
                ? 'bg-green-600 hover:bg-green-500 shadow-green-600/20' 
                : status === 'error'
                ? 'bg-red-600 hover:bg-red-500 shadow-red-600/20'
                : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/20'
            }`}
          >
            {isSubmitting ? 'Keeping Track...' : status === 'success' ? 'Saved!' : status === 'error' ? 'Connection Error' : 'Keep Track'}
          </Button>
          {status === 'error' && (
            <p className="text-xs text-red-400 text-center mt-2">
              Could not connect to the database. Is the server running?
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
};
