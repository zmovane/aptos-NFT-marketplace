export async function excuteTransaction(
  address: string,
  payload: {
    type: string;
    function: string;
    type_arguments: (string | string[] | undefined)[];
    arguments: (string | string[] | undefined)[];
  }
) {
  const transaction = await (window as any).martian.generateTransaction(
    address,
    payload
  );
  return await (window as any).martian.signAndSubmitTransaction(transaction);
}
