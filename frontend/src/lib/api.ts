'use client';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';

export type JobStatus =
  | 'pending' | 'step_1' | 'step_2' | 'step_3'
  | 'step_4' | 'step_5' | 'step_6' | 'complete' | 'failed';

export interface Job {
  id: string;
  status: JobStatus;
  alloy_id: string;
  press_id: string;
  step_file_name: string | null;
  pipe_radius_mm: number;
  capsule_wall_offset_mm: number;
  flange_r_mm: number;
  mass_post_machining_kg: number | null;
  bounding_box: { x: number; y: number; z: number } | null;
  acceptance_criteria: Array<{ label: string; value: string; standard: string }>;
  step_params: Record<string, unknown>;
  created_at: string;
  updated_at: string | null;
  error_message: string | null;
}

export interface CreateJobPayload {
  alloy_id: string;
  press_id: string;
  step_file_name?: string;
  pipe_radius_mm?: number;
  capsule_wall_offset_mm?: number;
  flange_r_mm?: number;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`API ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  createJob: (payload: CreateJobPayload) =>
    request<Job>('/jobs/', { method: 'POST', body: JSON.stringify(payload) }),

  advanceJob: (jobId: string, stepParams?: Record<string, unknown>) =>
    request<Job>(`/jobs/${jobId}/advance`, {
      method: 'POST',
      body: JSON.stringify({ step_params: stepParams ?? null }),
    }),

  getJob: (jobId: string) =>
    request<Job>(`/jobs/${jobId}`),

  listJobs: () =>
    request<Job[]>('/jobs/'),
};

export function jobStatusToStep(status: JobStatus): number {
  const map: Record<JobStatus, number> = {
    pending: 0, step_1: 1, step_2: 2, step_3: 3,
    step_4: 4, step_5: 5, step_6: 6, complete: 6, failed: 0,
  };
  return map[status] ?? 1;
}
