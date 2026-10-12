import React from 'react'

const PageNotFound = () => {
  document.title = `Page not found`;
  return (
    <>
      <main className="grid h-screen place-items-center px-6 py-24 sm:py-32 lg:px-8 mt-10 text-black dark:bg-black dark:text-white">
        <div className="bgColor absolute top-28 left-12 w-44 h-44 rounded-full bg-[#f76A2D] overflow-hidden blur-[85px] opacity-10 z-0 dark:opacity-20"></div>
        <div className="text-center">
          <p className="font-semibold text-indigo-600 text-6xl">404</p>
          <h1 className="mt-4 text-balance text-5xl font-semibold tracking-tight sm:text-7xl">
            Page not found
          </h1>
          <p className="mt-6 text-pretty text-lg font-medium text-gray-400 sm:text-xl/8">
            Sorry, we couldn’t find the page you’re looking for.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="/"
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-white text-sm font-semibold shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Go back home
            </a>
            <a href="/login" className="text-sm font-semibold">
              Login & SignUp <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>
      </main>
    </>
  )
}

export default PageNotFound