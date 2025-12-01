'use client';

import { FormEvent, ReactElement, useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { shouldShowQuestion } from '../../../utils/conditional';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';

type QuestionType =
  | 'singleLineText'
  | 'multilineText'
  | 'email'
  | 'url'
  | 'phoneNumber'
  | 'singleSelect'
  | 'multipleSelects'
  | 'multipleAttachments';

interface Question {
  questionKey: string;
  airtableFieldId?: string;
  label: string;
  type: QuestionType;
  required?: boolean;
  options?: string[];
  conditionalRules?: unknown;
}

interface FormResponse {
  _id: string;
  title: string;
  questions: Question[];
}

type AnswerValue = string | string[] | undefined;
type AnswersState = Record<string, AnswerValue>;

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

export default function FormViewer() {
  const { formId } = useParams<{ formId: string }>();
  const [form, setForm] = useState<FormResponse | null>(null);
  const [answers, setAnswers] = useState<AnswersState>({});
  const [submitted, setSubmitted] = useState(false);
  const endpoint = useMemo(() => (formId && API_URL ? `${API_URL}/api/forms/${formId}` : null), [formId]);

  useEffect(() => {
    if (!endpoint) return;

    fetch(endpoint)
      .then(res => res.json())
      .then((data: FormResponse) => setForm(data))
      .catch(err => console.error('Failed to load form', err));
  }, [endpoint]);

  if (!form) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-gray-600">Loading...</div>
    </div>
  );
  
  if (submitted) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">✓</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank you!</h2>
        <p className="text-gray-600">Your response has been recorded.</p>
      </div>
    </div>
  );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      const res = await fetch(`${API_URL}/api/forms/${formId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers })
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        alert(data.error || 'Submission failed');
      }
    } catch (err) {
      console.error(err);
      alert('Submission failed');
    }
  };

  const handleChange = (key: string, value: AnswerValue) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const visibleQuestions = form.questions.filter(q => shouldShowQuestion(q.conditionalRules, answers));
  const answeredCount = visibleQuestions.reduce((acc, q) => {
    const a = answers[q.questionKey];
    if (a === undefined || a === null) return acc;
    if (Array.isArray(a) && a.length === 0) return acc;
    if (a === '') return acc;
    return acc + 1;
  }, 0);
  const progress = visibleQuestions.length ? Math.round((answeredCount / visibleQuestions.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="px-8 py-6 bg-linear-to-r from-sky-600 to-indigo-600">
            <h1 className="text-2xl font-semibold text-white">{form.title}</h1>
            <p className="mt-1 text-sm text-sky-100">Please fill out the form below. Fields marked with <span className="text-red-200">*</span> are required.</p>
            <div className="mt-4 h-2 w-full rounded-full bg-sky-500/20">
              <div className="h-2 rounded-full bg-white shadow-sm" style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-2 text-xs text-sky-100">{answeredCount} of {visibleQuestions.length} answered ({progress}%)</div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {visibleQuestions.map((question, idx) => (
              <div key={question.questionKey} className="rounded-md border border-gray-100 bg-gray-50 p-4">
                <div className="mb-3 flex items-start justify-between">
                  <Label className="block text-sm font-medium text-gray-900">
                    {question.label} {question.required && <span className="text-red-600">*</span>}
                  </Label>
                </div>

                <div>
                  {renderInput(question, answers[question.questionKey], val => handleChange(question.questionKey, val))}
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between gap-4">
              <Button type="submit" className="flex-1 px-6 py-3">
                Submit Response
              </Button>

              <Button variant="ghost" type="button" onClick={() => { setAnswers({}); }}>
                Reset
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function renderInput(
  question: Question,
  value: AnswerValue,
  onChange: (val: AnswerValue) => void
): ReactElement {
  const type = question.type;
  
  if (type === 'singleLineText' || type === 'email' || type === 'url' || type === 'phoneNumber') {
    return (
      <Input
      className='text-black'
        type="text"
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        required={question.required}
      />
    );
  }

  if (type === 'multilineText') {
    return (
      <textarea
        className="w-full px-3 text-black py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-100 sm:text-sm"
        rows={3}
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        required={question.required}
      />
    );
  }

  if (type === 'singleSelect') {
    return (
      <Select
      className='text-black'
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        required={question.required}
      >
        <option value="">Select...</option>
        {question.options && question.options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </Select>
    );
  }

  if (type === 'multipleSelects') {
    const current = Array.isArray(value) ? value : [];
    return (
      <div className="space-y-2">
        {question.options && question.options.map(opt => (
          <div key={opt} className="flex items-center">
            <Input
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              checked={current.includes(opt)}
              onChange={e => {
                if (e.target.checked) {
                  onChange([...(current ?? []), opt]);
                } else if (current) {
                  onChange(current.filter(v => v !== opt));
                }
              }}
            />
            <Label className="ml-2 block text-sm text-gray-900">{opt}</Label>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'multipleAttachments') {
     return <div className="text-sm text-gray-500 italic">Attachments not supported in this demo viewer</div>;
  }

  return <div className="text-red-500">Unsupported type: {type}</div>;
}
