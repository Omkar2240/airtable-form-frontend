'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  AirtableBase,
  AirtableField,
  AirtableTable,
  FormQuestion,
  ConditionalRules,
  CreateFormPayload,
  CreateFormResponse
} from '@/types/Form';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function Builder() {
  const router = useRouter();

  const [userId, setUserId] = useState<string>('');
  const [bases, setBases] = useState<AirtableBase[]>([]);
  const [tables, setTables] = useState<AirtableTable[]>([]);
  const [fields, setFields] = useState<AirtableField[]>([]);
  const [formQuestions, setFormQuestions] = useState<FormQuestion[]>([]);
  const [selectedBase, setSelectedBase] = useState<string>('');
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [title, setTitle] = useState<string>('New Form');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const uid = localStorage.getItem('userId');
    if (!uid) {
      router.push('/');
      return;
    }
    setUserId(uid);
    fetchBases(uid);
  }, []);

  async function fetchBases(uid: string) {
    const res = await fetch(`${API_URL}/auth/airtable/bases`, {
      headers: { 'x-user-id': uid },
    });
    const data: AirtableBase[] = await res.json();
    setBases(data || []);
  }

  async function handleBaseChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const baseId = e.target.value;
    setSelectedBase(baseId);
    setSelectedTable('');
    setFormQuestions([]);
    setFields([]);

    const res = await fetch(`${API_URL}/auth/airtable/bases/${baseId}/tables`, {
      headers: { 'x-user-id': userId }
    });
    const data: AirtableTable[] = await res.json();
    setTables(data || []);
  }

  async function handleTableChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const tableId = e.target.value;
    setSelectedTable(tableId);
    setFormQuestions([]);

    const res = await fetch(
      `${API_URL}/auth/airtable/bases/${selectedBase}/tables/${tableId}/fields`,
      { headers: { 'x-user-id': userId } }
    );
    const data: AirtableField[] = await res.json();
    setFields(data || []);
  }

  function addField(field: AirtableField) {
    if (formQuestions.some(q => q.airtableFieldId === field.id)) return;

    const newQuestion: FormQuestion = {
      questionKey: field.id,
      airtableFieldId: field.id,
      label: field.name,
      type: field.type,
      required: false,
      options: field.options?.choices?.map(c => c.name) || [],
      conditionalRules: null
    };

    setFormQuestions(prev => [...prev, newQuestion]);
  }

  function updateQuestion(index: number, updates: Partial<FormQuestion>) {
    setFormQuestions(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], ...updates };
      return updated;
    });
  }

  function removeQuestion(index: number) {
    setFormQuestions(prev => prev.filter((_, i) => i !== index));
  }

  async function saveForm() {
    if (!selectedBase || !selectedTable || formQuestions.length === 0) return;

    setLoading(true);

    const payload: CreateFormPayload = {
      ownerUserId: userId,
      airtableBaseId: selectedBase,
      airtableTableId: selectedTable,
      title,
      questions: formQuestions
    };

    const res = await fetch(`${API_URL}/api/forms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-id': userId },
      body: JSON.stringify(payload)
    });

    const data: CreateFormResponse = await res.json();
    setLoading(false);

    if (data?._id) {
      router.push(`/form/${data._id}`);
    }
  }


  return (
    <div className="min-h-screen bg-neutral-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-6">
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-white">Form Builder</h1>
          <p className="text-sm text-neutral-300 mt-2">Build and map Airtable fields to create forms quickly.</p>
        </header>

        {/* FORM TITLE */}
        <div className="bg-neutral-800/60 p-6 rounded-2xl shadow-md mb-8 border border-neutral-700">
          <Label className="text-sm font-semibold text-neutral-100">Form Title</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-3 px-4 py-3 bg-neutral-800 text-white placeholder-neutral-400 border-neutral-700"
          />
        </div>

        {/* BASE + TABLE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-neutral-800/60 p-5 rounded-lg shadow-sm border border-neutral-700">
            <Label className="text-sm font-semibold text-neutral-100">Select Base</Label>
            <Select
              value={selectedBase}
              onChange={handleBaseChange}
              className="mt-2 bg-neutral-800 text-white placeholder-neutral-400 border-neutral-700"
            >
              <option value="">Choose Base</option>
              {bases.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </Select>
          </div>

          <div className="bg-neutral-800/60 p-5 rounded-lg shadow-sm border border-neutral-700">
            <Label className="text-sm font-semibold text-neutral-100">Select Table</Label>
            <Select
              value={selectedTable}
              disabled={!selectedBase}
              onChange={handleTableChange}
              className="mt-2 bg-neutral-800 text-white placeholder-neutral-400 border-neutral-700"
            >
              <option value="">Choose Table</option>
              {tables.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </Select>
          </div>
        </div>

        {/* FIELDS + QUESTIONS */}
        {selectedTable && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Available Fields */}
            <div className="bg-neutral-800/50 p-6 rounded-lg shadow-sm border border-neutral-700 h-[480px] top-24 overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">Available Fields</h3>
              <div className="space-y-2">
                {fields.map((f) => (
                  <Button
                    key={f.id}
                    onClick={() => addField(f)}
                    className="w-full flex items-center justify-between px-3 py-2 border border-neutral-700 rounded-md hover:shadow-sm hover:bg-neutral-700 transition text-white"
                    variant="ghost"
                  >
                    <div className="text-left w-full">
                      <div className="text-sm font-medium text-white">{f.name}</div>
                      <div className="text-xs text-neutral-300">{f.type}</div>
                      {f.options?.choices && (
                        <div className="text-xs text-neutral-400 mt-1">
                          Options: {f.options.choices.map(c => c.name).join(', ')}
                        </div>
                      )}
                    </div>
                    <div className="text-blue-400 font-semibold">Add</div>
                  </Button>
                ))}
                {fields.length === 0 && <div className="text-gray-400">No fields available</div>}
              </div>
            </div>

            {/* Added Questions */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Form Questions</h3>
                <div className="text-sm text-gray-500">{formQuestions.length} question(s)</div>
              </div>

              <div className="space-y-5">
                {formQuestions.map((q, idx) => (
                  <div key={q.questionKey} className="bg-neutral-800/50 p-5 rounded-xl border border-neutral-700 shadow-sm relative">

                    {/* Delete */}
                    <Button
                      onClick={() => removeQuestion(idx)}
                      aria-label="Remove question"
                      className="absolute right-4 top-4 text-red-500 font-bold bg-red-50 rounded-full w-7 h-7 flex items-center justify-center p-0"
                      variant="danger"
                    >
                      ✕
                    </Button>

                    {/* Label */}
                    <div className="mb-4">
                      <Label className="font-medium text-neutral-100">Label</Label>
                      <Input
                        value={q.label}
                        onChange={(e) =>
                          updateQuestion(idx, { label: e.target.value })
                        }
                        className="mt-2 bg-neutral-800 text-white placeholder-neutral-400 border-neutral-700"
                      />
                    </div>

                    <div className="flex flex-wrap gap-4 items-center mb-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={q.required}
                          onChange={(e) =>
                            updateQuestion(idx, { required: e.target.checked })
                          }
                          className="w-4 h-4"
                        />
                        <span className="text-sm">Required</span>
                      </label>

                      <div className="text-sm text-gray-500">Type: <span className="font-medium text-gray-700">{q.type}</span></div>
                    </div>

                    {/* Conditional Logic */}
                    <div className="border-t pt-4">
                      <p className="text-sm font-semibold mb-2 text-neutral-100">Conditional Logic</p>

                      <Select
                        value={q.conditionalRules?.conditions?.[0]?.questionKey || ''}
                        onChange={(e) => {
                          const parentKey = e.target.value;

                          if (!parentKey)
                            return updateQuestion(idx, { conditionalRules: null });

                          const rules: ConditionalRules = {
                            logic: 'AND',
                            conditions: [
                              { questionKey: parentKey, operator: 'equals', value: '' }
                            ]
                          };

                          updateQuestion(idx, { conditionalRules: rules });
                        }}
                        className="mb-3 bg-neutral-800 text-white placeholder-neutral-400 border-neutral-700"
                      >
                        <option value="">Always Show</option>
                        {formQuestions.slice(0, idx).map((p) => (
                          <option key={p.questionKey} value={p.questionKey}>
                            {p.label}
                          </option>
                        ))}
                      </Select>

                      {q.conditionalRules && (
                        <div className="flex gap-3 mt-1">
                          <Select
                            value={q.conditionalRules.conditions[0].operator}
                            onChange={(e) => {
                              const next = { ...(q.conditionalRules || {}) } as ConditionalRules;
                              next.conditions = next.conditions ?? [{ questionKey: '', operator: 'equals', value: '' }];
                              next.conditions[0].operator = e.target.value as any;
                              updateQuestion(idx, { conditionalRules: next });
                            }}
                            className="px-3 py-2 bg-neutral-800 text-white border-neutral-700"
                          >
                            <option value="equals">equals</option>
                            <option value="notEquals">not equals</option>
                            <option value="contains">contains</option>
                          </Select>

                          <Input
                            value={q.conditionalRules.conditions[0].value}
                            onChange={(e) => {
                              const next = { ...(q.conditionalRules || {}) } as ConditionalRules;
                              next.conditions = next.conditions ?? [{ questionKey: '', operator: 'equals', value: '' }];
                              next.conditions[0].value = e.target.value;
                              updateQuestion(idx, { conditionalRules: next });
                            }}
                            placeholder="value"
                            className="flex-1 bg-neutral-800 text-white placeholder-neutral-400 border-neutral-700"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {formQuestions.length > 0 && (
                <div className="mt-6">
                  <Button
                    onClick={saveForm}
                    disabled={loading}
                    className="w-full gap-2 py-3 font-semibold"
                  >
                    {loading ? 'Saving...' : 'Save Form'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
