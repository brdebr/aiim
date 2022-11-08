
export const useRouteQry = (prop: string) => {
  const route = useRoute();
  return computed<string>(() => {
    return [route.query[prop]].flat().join("");
  })
}
