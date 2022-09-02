export async function excuteTransaction(
  address: string,
  payload: {
    type: string;
    function: string;
    type_arguments: any[];
    arguments: any[];
  }
) {
  const transaction = await (window as any).martian.generateTransaction(
    address,
    payload
  );
  return await (window as any).martian.signAndSubmitTransaction(transaction);
}
