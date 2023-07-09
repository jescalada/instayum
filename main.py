# Script for mining recipes from a recipe website
import sys

import requests
from bs4 import BeautifulSoup, PageElement
import json


def html_table_to_json(content: PageElement, indent=None):
    """
    Converts an HTML table to its JSON array representation.
    :param content: a PageElement object representing an HTML table
    :param indent: a number representing the desired indentation in the JSON output
    :return: a string in JSON format
    """
    rows = content.find_all("tr")
    headers = {}
    thead = content.find("thead")
    if thead:
        thead = content.find_all("th")
        for i in range(len(thead)):
            headers[i] = "".join([word.capitalize() if j != 0 else word for j, word in enumerate(thead[i].text.lower().replace("(", "").replace(")", "").split(" "))])
    data = []
    for i, row in enumerate(rows):
        cells = row.find_all("td")
        if thead:
            items = {}
            if len(cells) > 0:
                for index in headers:
                    items[headers[index]] = cells[index].text
        else:
            items = []
            for index in cells:
                items.append(index.text.strip())
        if items:
            data.append(items)
    return json.dumps(data, indent=indent)


def scrape_and_convert(recipe_id: int) -> (str, str, str, list[str]):
    """
    Scrapes a recipe from RecipeDB and converts the data into a tuple.
    :param recipe_id:
    :return: a tuple of str, str, str and list[str]
    """
    url = f"https://cosylab.iiitd.edu.in/recipedb/search_recipeInfo/{recipe_id}"
    page = requests.get(url)

    soup = BeautifulSoup(page.content, "html.parser")
    recipe_name = None
    image_filename = None
    ingredients = None
    steps = None
    try:
        recipe_name = soup.find_all("h3")[0].text
        image_filename = soup.find_all("img", class_="responsive-img")[0]["src"]
        ingredients = soup.find("div", id="ingredient_nutri").find("table")
        steps = soup.find("div", id="steps")
    except IndexError:
        print(f"Done goofed at recipe_id={recipe_id}", file=sys.stderr)
        pass
    return (recipe_name,
            image_filename,
            html_table_to_json(content=ingredients, indent=4),
            [step.strip(" -\n") for step in steps.text.split("|") if step.strip(" -\n") != ""])


def jsonify_recipe(recipe_id, recipe_name, image_filename, ingredients, steps):
    """
    Convert recipe tuple into JSON.
    """
    return f'{{ "recipeId": "{recipe_id}", "recipeName": "{recipe_name}", "imageFilename": "{image_filename}", "ingredients": {ingredients}, "steps": {json.dumps(steps)} }}'


if __name__ == '__main__':
    # These are the limits of the valid ID ranges in the RecipeDB
    MINIMUM_ID = 2610
    MAXIMUM_ID = 149191
    file = open('recipes.json', 'a+')
    file.write('[')
    skipped_count = 0
    recipe_count = 1
    for i in range(MINIMUM_ID, MAXIMUM_ID + 1):
        recipe_name, image_filename, ingredients, steps = scrape_and_convert(i)
        if not recipe_name or not image_filename or not ingredients or not steps:
            skipped_count += 1
            continue
        recipe_json = jsonify_recipe(recipe_count, recipe_name, image_filename, ingredients, steps)
        recipe_count += 1
        file.write(recipe_json)
        if i != MAXIMUM_ID: file.write(f', ')
    file.write(']')
    file.close()
    print(f'Skipped {skipped_count} pages due to incomplete data.')
