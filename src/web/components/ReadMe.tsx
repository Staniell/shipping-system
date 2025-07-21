export default function ReadMe() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen text-gray-800">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-gray-900">Doss Take Home Technical Challenge</h2>
        <p className="mb-6 text-lg leading-relaxed">
          Welcome to the Doss take home technical challenge. This is meant mostly as a way for us to
          evaluate your ability to work in a foreign codebase on some technical tasks - it is meant to
          be a much more relevant version of a technical interview than the classic algorithmic
          interview.
        </p>

        <h4 className="text-2xl font-semibold mb-4 text-gray-900">Who are we?</h4>
        <p className="mb-6 text-lg leading-relaxed">
          Some background information on Doss - we are focused on building a cloud collaboration
          platform to help operations teams (Supply Chain / Finance / Logistics) manage internal and
          external processes. Our customers use our platform to visualize and interact with their
          entire supply chain.
        </p>

        <h4 className="text-2xl font-semibold mb-4 text-gray-900">What is your job?</h4>
        <p className="mb-6 text-lg leading-relaxed">
          On our platform, our customers interface with a series of nested "workspaces" that represent
          different parts of their supply chain (i.e. factories, warehouses, suppliers, etc). Each of
          these workspaces is made up of various visualizations such as tables, charts, graphs, and
          file viewers.
        </p>
        <p className="mb-6 text-lg leading-relaxed">
          Your high level task will be to use the existing codebase to flesh out a viewer for a list
          of workspaces and their corresponding tables. In other words, you are building our "
          <b className="font-bold">Dosspace</b>."
        </p>

        <h4 className="text-2xl font-semibold mb-4 text-gray-900">The details</h4>
        <p className="mb-6 text-lg leading-relaxed">
          The application should help users track data across their workspaces. Specifically, we are
          looking for the following to be done:
        </p>
        <ul className="list-disc list-inside mb-6 text-lg space-y-2">
          <li>There's UT(s) failing. Figure out why and fix it!</li>
          <li>Add a way to view the tables in a workspace</li>
          <li>
            Add a new API endpoint to add tables to a workspace and hook that up to the front-end
          </li>
        </ul>

        <h4 className="text-2xl font-semibold mb-4 text-gray-900">Evaluation criteria</h4>
        <ul className="list-disc list-inside mb-6 text-lg space-y-2">
          <li>
            <b className="font-semibold">Functionality:</b> The app should work as the instructions dictate. None of the core
            flows should cause any errors. Anything extra is always a bonus, but not necessary.
          </li>
          <li>
            <b className="font-semibold">Coding style:</b> You should follow general best practices and adhere to the standards
            set in the codebase. If any significant deviants are made, feel free to indicate the
            reasoning in comments or in your submission.
          </li>
        </ul>

        <h4 className="text-2xl font-semibold mb-4 text-gray-900">Getting started</h4>
        <p className="text-lg leading-relaxed">
          Since you already got to this point, you clearly have the application running! The next
          place to look would be to familiarize yourself with the codebase - all relevant web
          components are under the <i className="italic">components.tsx</i> and all the core API functions are in{' '}
          <i className="italic">app.ts</i>. Feel free to ask questions along the way, happy to help if you get stuck or
          need any guidance. But this is also intentionally open-ended, and we're excited to see what
          direction you take it!
        </p>
      </div>
    </div>
  )
}
