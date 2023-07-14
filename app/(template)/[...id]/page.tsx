export default async function TemplateSubPage({ params, searchParams }: any) {
  try {

    // You have to set a favicon in template, otherwise you will get ['favicon.ico'] within params
    const id = params["id"][0]

    return (
      <div className="my-1 grid">
        template
      </div>
    )
  } catch (e: any) {}
}
