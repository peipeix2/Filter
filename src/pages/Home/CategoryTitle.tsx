interface CategoryTitleState {
  category: string
  slogan: string
}

const CategoryTitle = ({ category, slogan }: CategoryTitleState) => {
  return (
    <div className="mx-auto mb-2 text-right font-extrabold">
      <p className="text-sm">{category}</p>
      <p className="text-2xl">{`/ ${slogan}`}</p>
    </div>
  )
}

export default CategoryTitle
