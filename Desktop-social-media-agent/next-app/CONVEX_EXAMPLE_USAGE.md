# Convex Usage Examples

Quick examples of how to use Convex in your Post Planner components.

## Basic Pattern

```typescript
'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
```

## Example 1: Fetch and Display Posts

```typescript
function RecipesList() {
  // Query runs automatically and updates when data changes
  const recipes = useQuery(api.posts.getPostsByType, {
    contentType: 'recipes'
  });

  if (recipes === undefined) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>My Recipes ({recipes.length})</h2>
      {recipes.map(recipe => (
        <div key={recipe._id}>
          <h3>{recipe.title}</h3>
          <p>{recipe.content}</p>
          {recipe.tags && <span>Tags: {recipe.tags}</span>}
        </div>
      ))}
    </div>
  );
}
```

## Example 2: Create New Post

```typescript
function AddRecipeForm() {
  const createPost = useMutation(api.posts.createPost);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createPost({
        title,
        content,
        contentType: 'recipes',
        tags: 'healthy,quick',
      });

      // Clear form
      setTitle('');
      setContent('');
      alert('Recipe added!');
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Recipe title"
        required
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Recipe content"
        required
      />
      <button type="submit">Add Recipe</button>
    </form>
  );
}
```

## Example 3: Update Post

```typescript
function RecipeEditor({ recipeId }: { recipeId: Id<"posts"> }) {
  const updatePost = useMutation(api.posts.updatePost);

  const handleMarkAsUsed = async () => {
    try {
      await updatePost({
        id: recipeId,
        used: true,
      });
    } catch (error) {
      console.error('Failed to update:', error);
    }
  };

  return (
    <button onClick={handleMarkAsUsed}>
      Mark as Used
    </button>
  );
}
```

## Example 4: Delete Post

```typescript
function RecipeItem({ recipe }: { recipe: Doc<"posts"> }) {
  const deletePost = useMutation(api.posts.deletePost);

  const handleDelete = async () => {
    if (!confirm('Delete this recipe?')) return;

    try {
      await deletePost({ id: recipe._id });
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  return (
    <div>
      <h3>{recipe.title}</h3>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
}
```

## Example 5: Scheduled Content Calendar

```typescript
function CalendarView() {
  const scheduledContent = useQuery(api.scheduledContent.getScheduledContent);
  const createContent = useMutation(api.scheduledContent.createScheduledContent);
  const deleteContent = useMutation(api.scheduledContent.deleteScheduledContent);

  const handleSchedule = async (date: string) => {
    await createContent({
      title: 'My Post',
      content: 'Post content here',
      date,
      time: '09:00',
      platform: 'instagram',
      status: 'scheduled',
    });
  };

  return (
    <div>
      <h2>Scheduled Posts</h2>
      {scheduledContent?.map(item => (
        <div key={item._id}>
          <div>{item.date} at {item.time}</div>
          <div>{item.title}</div>
          <div>Platform: {item.platform}</div>
          <div>Status: {item.status}</div>
          <button onClick={() => deleteContent({ id: item._id })}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
```

## Example 6: Weekly Presets

```typescript
function PresetsManager() {
  const presets = useQuery(api.presets.getPresets);
  const createPreset = useMutation(api.presets.createPreset);
  const deletePreset = useMutation(api.presets.deletePreset);

  const handleCreatePreset = async () => {
    await createPreset({
      name: 'My Weekly Schedule',
      description: 'Default posting schedule',
      schedule: {
        monday: { enabled: true, topic: 'recipes', time: '09:00' },
        tuesday: { enabled: true, topic: 'workouts', time: '10:00' },
        wednesday: { enabled: true, topic: 'realestate', time: '11:00' },
        thursday: { enabled: false, topic: '', time: '' },
        friday: { enabled: true, topic: 'mindfulness', time: '09:00' },
        saturday: { enabled: true, topic: 'lifestyle', time: '10:00' },
        sunday: { enabled: false, topic: '', time: '' },
      },
      platforms: {
        instagram: true,
        linkedin: true,
        facebook: false,
      },
    });
  };

  return (
    <div>
      <button onClick={handleCreatePreset}>Create Preset</button>
      {presets?.map(preset => (
        <div key={preset._id}>
          <h3>{preset.name}</h3>
          <p>{preset.description}</p>
          <button onClick={() => deletePreset({ id: preset._id })}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
```

## Example 7: Real-time Stats Dashboard

```typescript
function StatsDashboard() {
  const stats = useQuery(api.posts.getPostStats);
  const scheduledCount = useQuery(api.scheduledContent.getScheduledContentCount);

  return (
    <div>
      <h2>Dashboard Stats</h2>
      <div>Total Posts: {stats?.totalPosts || 0}</div>
      <div>Used Posts: {stats?.usedPosts || 0}</div>
      <div>Available Posts: {stats?.availablePosts || 0}</div>
      <div>Scheduled: {scheduledCount || 0}</div>
    </div>
  );
}
```

## Example 8: Filtering Posts by Date

```typescript
function PostsByDate({ date }: { date: string }) {
  const content = useQuery(api.scheduledContent.getScheduledContentByDate, {
    date
  });

  return (
    <div>
      <h3>Posts for {date}</h3>
      {content?.map(item => (
        <div key={item._id}>{item.title}</div>
      ))}
    </div>
  );
}
```

## Important Notes

### Loading States
```typescript
const data = useQuery(api.posts.getAllPosts);

if (data === undefined) {
  return <div>Loading...</div>;
}

if (data.length === 0) {
  return <div>No posts yet</div>;
}

return <div>{/* Render data */}</div>;
```

### Error Handling
```typescript
const createPost = useMutation(api.posts.createPost);

try {
  await createPost({ /* args */ });
} catch (error) {
  console.error('Error:', error);
  // Show user-friendly error message
}
```

### Optimistic Updates
Convex automatically handles optimistic updates - the UI updates immediately and rolls back if the mutation fails.

### TypeScript Types
```typescript
import { Id, Doc } from '@/convex/_generated/dataModel';

// ID type
const postId: Id<"posts"> = recipe._id;

// Document type
const post: Doc<"posts"> = { /* ... */ };
```

## Migration Strategy

Replace existing localStorage/state with Convex:

### Before (useState):
```typescript
const [posts, setPosts] = useState<Post[]>([]);
```

### After (Convex):
```typescript
const posts = useQuery(api.posts.getPostsByType, { contentType: 'recipes' });
const createPost = useMutation(api.posts.createPost);
const updatePost = useMutation(api.posts.updatePost);
const deletePost = useMutation(api.posts.deletePost);
```

## Benefits

✅ **Real-time**: Changes sync instantly across tabs/devices
✅ **Persistent**: Data saved to cloud automatically
✅ **Type-safe**: Full TypeScript support
✅ **Secure**: User isolation built-in
✅ **Scalable**: No database setup needed
✅ **Offline**: Queries cache locally

Start small - migrate one component at a time! 🚀
