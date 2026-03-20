/**
 * HTTP通信ユーティリティ。
 * fetch APIを使用し、メインスレッドをブロックしない非同期通信を行う。
 */

/** 指定URLからバイナリデータを取得する */
export async function fetchBinary(url: string): Promise<ArrayBuffer> {
  const res = await fetch(url);
  return res.arrayBuffer();
}

/** 指定URLからJSONデータを取得する */
export async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url);
  return res.json() as Promise<T>;
}

/** 指定URLにファイルをPOST送信する */
export async function sendFile<T>(url: string, file: File): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    body: file,
    headers: {
      "Content-Type": "application/octet-stream",
    },
  });
  return res.json() as Promise<T>;
}

/** 指定URLにJSONデータをPOST送信する */
export async function sendJSON<T>(url: string, data: object): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.json() as Promise<T>;
}
