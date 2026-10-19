import { tablesDB, TablesDB_ID, COLLECTIONS, ID, Query } from "@/lib/appwrite";

export async function createPost(userId, userEmail, userName, content) {
  try {
    const row = await tablesDB.createRow({
      databaseId: TablesDB_ID,
      tableId: COLLECTIONS.POSTS,
      rowId: ID.unique(),
      data: {
        userId,
        userEmail,
        userName,
        content,
        image: "",
        likes: 0,
        coments: 0,
      },
    });

    return {
      success: true,
      post: row,
    };
  } catch (error) {
    console.error("Create post error:", error.message);

    return {
      success: false,
      error: error.message,
    };
  }
}

export async function getAllPosts() {
  try {
    const result = await tablesDB.listRows({
      databaseId: TablesDB_ID,
      tableId: COLLECTIONS.POSTS,
      queries: [Query.orderDesc("$createdAt")],
    });

    return {
      success: true,
      posts: result.rows,
    };
  } catch (error) {
    console.error("Get posts error:", error.message);

    return {
      success: false,
      error: error.message,
    };
  }
}

export async function getUserPosts(userId) {
  try {
    const result = await tablesDB.listRows({
      databaseId: TablesDB_ID,
      tableId: COLLECTIONS.POSTS,
      queries: [
        Query.equal("userId", userId),
        Query.orderDesc("$createdAt"),
      ],
    });

    return {
      success: true,
      posts: result.rows,
    };
  } catch (error) {
    console.error("Get user posts error:", error.message);

    return {
      success: false,
      error: error.message,
    };
  }
}

export async function deletePost(postId) {
  try {
    await tablesDB.deleteRow({
      databaseId: TablesDB_ID,
      tableId: COLLECTIONS.POSTS,
      rowId: postId,
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Delete post error:", error.message);

    return {
      success: false,
      error: error.message,
    };
  }
}