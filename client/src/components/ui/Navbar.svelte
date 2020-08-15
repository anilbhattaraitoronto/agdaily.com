<script>
  import { push } from "svelte-spa-router";
  import {
    user,
    successMessage,
    failureMessage
  } from "../../stores/authstore.js";

  function logout() {
    if ($user) {
      localStorage.removeItem("user");
      $user = null;
      $successMessage = "You are successfully logged out.";
      push("/");
    }
  }
</script>

<style>
  nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  button {
    all: unset;
    cursor: pointer;
  }

  .main-link {
    color: darkblue;
  }
  .main-link:hover {
    text-decoration: underline;
  }
</style>

<nav>
  <h1 class="masthead">
    <a href="#/" class="main-link">aG - Daily</a>
  </h1>
  <div class="navbar">
    {#if !$user}
      <a href="#/login" class="main-link">Login</a>
      <a href="#/signup" class="main-link">Signup</a>
    {:else}
      <button class="main-link" on:click={logout}>Logout</button>
    {/if}
    {#if $user && JSON.parse($user).status === 1}
      <a href="#/addpost" class="main-link">Add Post</a>
    {/if}
  </div>
</nav>
