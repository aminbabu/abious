import { SetMetadata } from '@nestjs/common';

export const BYPASS_TRANSFORM_KEY = 'bypass_transform_response';
export const BypassTransform = () => SetMetadata(BYPASS_TRANSFORM_KEY, true);
