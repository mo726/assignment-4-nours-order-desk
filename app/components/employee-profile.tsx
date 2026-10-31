type Employee = {
  name: string;
  email: string;
  company: {
    name: string;
  };
};

export async function EmployeeProfile() {
  let employee: Employee | null = null;

  try {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/users/1",
    );

    if (!response.ok) {
      throw new Error(`Profile request failed with HTTP ${response.status}.`);
    }

    employee = await response.json();
  } catch {
    employee = null;
  }

  if (!employee) {
    return (
      <section
        role="alert"
        className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-900 dark:border-amber-900/70 dark:bg-amber-950/40 dark:text-amber-100"
      >
        <h2 className="font-semibold">Employee profile unavailable</h2>
        <p className="mt-1 text-sm">
          We couldn’t load Yehia’s profile. The other dashboard sections are
          still available.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
        Server-fetched profile
      </p>
      <h2 className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        {employee.name}
      </h2>
      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="font-medium text-zinc-500 dark:text-zinc-400">Email</dt>
          <dd className="mt-1 text-zinc-700 dark:text-zinc-200">
            {employee.email}
          </dd>
        </div>
        <div>
          <dt className="font-medium text-zinc-500 dark:text-zinc-400">
            Company
          </dt>
          <dd className="mt-1 text-zinc-700 dark:text-zinc-200">
            {employee.company.name}
          </dd>
        </div>
      </dl>
    </section>
  );
}
