// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** getAppTypeDistribution GET /api/statical/app/app_type_distribution */
export async function getAppTypeDistributionUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseListAppTypeDistribution_>(
    '/api/statical/app/app_type_distribution',
    {
      method: 'GET',
      ...(options || {}),
    },
  );
}

/** getHotAppDistribution GET /api/statical/app/hot */
export async function getHotAppDistributionUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseListHotAppDistribution_>('/api/statical/app/hot', {
    method: 'GET',
    ...(options || {}),
  });
}

/** getReviewPassRateDistribution GET /api/statical/app/review_pass_rate */
export async function getReviewPassRateDistributionUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseListReviewPassRateDistribution_>(
    '/api/statical/app/review_pass_rate',
    {
      method: 'GET',
      ...(options || {}),
    },
  );
}

/** getScoringStrategyDistribution GET /api/statical/app/scoring_strategy_distribution */
export async function getScoringStrategyDistributionUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseListScoringStrategyDistribution_>(
    '/api/statical/app/scoring_strategy_distribution',
    {
      method: 'GET',
      ...(options || {}),
    },
  );
}

/** getUserAnswerGrowthRecord GET /api/statical/user/answer/growth */
export async function getUserAnswerGrowthRecordUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseUserAnswerGrowthRecord_>('/api/statical/user/answer/growth', {
    method: 'GET',
    ...(options || {}),
  });
}

/** getUserAnswerParticipation GET /api/statical/user/answer/participation */
export async function getUserAnswerParticipationUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseListUserAnswerParticipation_>(
    '/api/statical/user/answer/participation',
    {
      method: 'GET',
      ...(options || {}),
    },
  );
}
