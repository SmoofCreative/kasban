# Reducers

This state in kasban has been normalised so that we can get, update and remove data easier than if the data was nested.

The state is split into entities and other data sources.

### Entities

So what is the point in entities? Using entities means that we can update a childrens' data without having to loop through a nested tree.

Here is an example of a nested tree:

```
// DONT DO THIS!!
{
  workspaces: [
    {
      id: 1,
      name: 'Company X',
      projects: [
        {
          id: 21,
          name: 'Finance',
          sections: [
            {
               id: 31,
               name: 'Do A.S.A.P',
               cards: [
                {
                  id: 41,
                  name: 'Call the bank'
                },
                {
                  id: 42,
                  name: 'Pay taxes'
                }
               ]
            }
          ]
        }
      ]
    }
  ]
}
```

This kind of structure allows easy presentation in a nested UI by mapping through each array and it's child array.

However, what happens if you want to change the name of the card `41`? You would need to loop through each object to find the right card.
If this scaled to have thousands of cards looping through each structure for a simple name change would not be a great UX on slower devices.

##### So what's the solution?

*Entities!*

Imagine a tree with this structure.

```
{
  currentWorkspaces: [1],
  entities: {
    workspaces: {
      1: {
        id: 1,
        name: 'Company X',
        projects: [21]
      }
    },
    projects: {
      21: {
        id: 21,
        name: 'Finance',
        sections: [31]
      }
    },
    sections: {
      31: {
        id: 31,
        name: 'Do A.S.A.P',
        cards: [41, 42]
      }
    },
    cards: {
      41: {
        id: 41,
        name: 'Call the bank'
      },
      42: {
        id: 42,
        name: 'Call the bank'
      }
    }
  }
}
```

Now changes a card name is trivial, all that is required is the card id and better yet the rest of the data is none the wiser.

