// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** generateSnowFlakeNextId GET /api/base/generate/id */
export async function generateSnowFlakeNextIdUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseLong_>('/api/base/generate/id', {
    method: 'GET',
    ...(options || {}),
  });
}
