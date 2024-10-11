import { useRouter } from 'next/router';

const RecipeDetailsPage = () => {
  const router = useRouter();
  const { title, time, image, recipe, location } = router.query;  // Access the recipe data passed through the query

  return (
    <div className="recipe-details-page">
      <h1 className="text-2xl font-bold">{title}</h1>
      <img src={image} alt={title} className="w-full h-64 object-cover mt-4" />
      <p className="mt-4">Time: {time} minutes</p>
      <p className="mt-4">Location: {location}</p>
      <div className="mt-4">
        <h2 className="font-bold">Recipe:</h2>
        <p>{recipe}</p>
      </div>
    </div>
  );
};

export default RecipeDetailsPage;
