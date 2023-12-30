interface SubCategoryState {
  subCategory: string
}

const SubCategoryTitle = ({ subCategory }: SubCategoryState) => {
  return (
    <p className="text-sm font-semibold text-[#475565] md:text-base">
      {subCategory}
    </p>
  )
}

export default SubCategoryTitle
