interface SubCategoryState {
  subCategory: string
}

const SubCategoryTitle = ({ subCategory }: SubCategoryState) => {
  return <p className="text-base font-semibold text-[#475565]">{subCategory}</p>
}

export default SubCategoryTitle
