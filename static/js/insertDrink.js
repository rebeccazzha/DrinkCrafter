document.querySelector('#drink-form').addEventListener('submit', async function(e) {
  e.preventDefault(); // Prevents the default form submission behavior

  const name = document.querySelector('#name').value;
  const image_url = document.querySelector('#image_url').value;
  const ingredients = document.querySelector('#ingredients').value;
  const base = document.querySelector('#base').value;
  const recipe = document.querySelector('#recipe').value;

  const formData = { name, image_url, ingredients, base, recipe };

  try {
    const response = await fetch('/api/postDrink', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });

    if(response.ok) {
      alert('Form submitted successfully!');
      window.location.href = '../recipe.html';
    } else {
      alert('Failed to submit the form. Please try again.');
    }

  } catch (error) {
    console.error('Error submitting form:', error);
  }
});