export interface IStandardResponse<T> {
  status: string;
  message: string;
  data?: T;
}

export const SendApiResponse = <T>(
  message: string,
  data?: T,
  status: string = 'success',
): IStandardResponse<T> => {
  return {
    status,
    message,
    data,
  };
};
