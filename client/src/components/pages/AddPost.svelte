<script>
  import { postData } from "../../App.svelte";
  import {
    user,
    successMessage,
    failureMessage
  } from "../../stores/authstore.js";
  import { push } from "svelte-spa-router";

  let thumbnail = "";
  let title = "";
  let author = "";
  let brief = "";
  let content = "";

  const addPostUrl = "http://localhost:4004/api/posts/addpost";
  //   function getUserToken() {
  //     if ($user) {
  //       let token = JSON.parse($user).token;
  //       return token;
  //     }
  //   }

  async function addPost() {
    await postData(
      addPostUrl,
      { thumbnail, title, author, brief, content },
      JSON.parse($user).token
    )
      .then(data => {
        if (data.success) {
          $successMessage = data.success;
          console.log("Data received", data);
          push("/");
        } else {
          //do something else
          $failureMessage = data.message;
        }
      })
      .catch(error => {
        console.log("AddPost error is: ", error);
      });
  }
</script>

<style>
  h2 {
    text-align: center;
    letter-spacing: 2px;
  }
  form {
    width: 100%;
    max-width: 650px;
    padding: 20px;
    margin: 20px auto;
    background: rgb(231, 233, 240);
  }
  label {
    width: 80%;
    margin: 4px auto;
    letter-spacing: 2px;
    font-size: 0.9em;
  }
  input,
  textarea {
    all: unset;
    display: block;
    width: 80%;
    transition: 300ms all ease-in-out;
    margin: 4px auto;
    background: white;
    padding: 4px;
    margin-bottom: 4px;
  }
  input[type="submit"] {
    text-align: center;
    letter-spacing: 2px;
    background: darkblue;
    color: white;
    cursor: pointer;
  }

  input:focus,
  textarea:focus {
    width: 100%;
    border: 1px solid darkblue;
  }
  input[type="submit"]:hover {
    width: 100%;
  }
</style>

{#if $user && JSON.parse($user).status === 1}
  <main>
    <form on:submit|preventDefault={addPost}>
      <h2>Add Post</h2>
      <label for="thumbnail">Thumbnail</label>
      <input type="text" id="thumbnail" bind:value={thumbnail} required />
      <label for="title">Title</label>
      <input type="text" id="title" bind:value={title} required />
      <label for="author">Author</label>
      <input type="text" id="author" bind:value={author} required />
      <label for="brief">Brief</label>
      <input type="text" id="brief" bind:value={brief} required />
      <label for="content">Content</label>
      <textarea name="" id="" cols="30" rows="10" bind:value={content} />
      <input type="submit" value="Add Post" />
    </form>
  </main>
{/if}
