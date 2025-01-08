import TopTabs from './TopTabs'

function RightContent(): JSX.Element {
  // const title = useStore((state: any) => state.title)

  return (
    <div className="h-full overflow-hidden bg-white border-l border-[#f5f5f5]">
      <div className="h-full p-4">
        <TopTabs />
      </div>
    </div>
  )
}

export default RightContent
