<script>
  import { postData } from "../../App.svelte";
  import { push } from "svelte-spa-router";
  import {
    user,
    successMessage,
    failureMessage
  } from "../../stores/authstore.js";
  let email = "";
  let password = "";

  const postUrl = "http://localhost:4004/api/auth/login";
  const userData = { email, password };
  async function login() {
    await postData(postUrl, { email, password }, "Hello Login")
      .then(data => {
        if (data.token) {
          $successMessage = "You are logged in.";
          localStorage.setItem("user", JSON.stringify(data));
          $user = localStorage.getItem("user");
          push("/");
        } else {
          $failureMessage = data.message;
        }
      })
      .catch(error => {
        console.log(error);
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
  input {
    all: unset;
    display: block;
    width: 80%;
    transition: 300ms all ease-in-out;
    margin: auto;
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
  input[type="submit"]:hover {
    width: 100%;
  }
  p {
    text-align: center;
  }
</style>

{#if !$user}
  <main>
    {#if $failureMessage}
      <p>{$failureMessage}</p>
    {/if}
    <form on:submit|preventDefault={login}>
      <h2 class="page-title">Login</h2>
      <label for="email">Email</label>
      <input type="email" id="email" bind:value={email} reaquired />
      <label for="password">Password</label>
      <input type="password" id="password" bind:value={password} required />
      <input type="submit" value="Login" />
    </form>
    <p>
      No account yet? You can
      <a href="#/signup">Signup for new account.</a>
    </p>
  </main>
{/if}
