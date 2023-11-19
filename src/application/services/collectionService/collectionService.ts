export interface SortByLengthDescendingPayload {
  data: string[];
}

export interface SortByLengthAscendingPayload {
  data: string[];
}

export class CollectionService {
  public static sortByLengthDescending(payload: SortByLengthDescendingPayload): void {
    const { data } = payload;

    data.sort((str1, str2) => {
      if (str1.length < str2.length) {
        return 1;
      } else if (str1.length === str2.length) {
        return 0;
      } else {
        return -1;
      }
    });
  }

  public static sortByLengthAscending(payload: SortByLengthAscendingPayload): void {
    const { data } = payload;

    data.sort((str1, str2) => {
      if (str1.length > str2.length) {
        return 1;
      } else if (str1.length === str2.length) {
        return 0;
      } else {
        return -1;
      }
    });
  }
}
