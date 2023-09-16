import { Database } from "~/utils/supabase";

export const useBackend = () => {
  const client = useSupabaseClient<Database>();

  interface FilterCondition {
    field: string;
    value: any;
    operator?: string;
  }

  interface InsertUpdateOptions<T extends keyof Database["public"]["Tables"]> {
    table: T;
    data:
      | Partial<Database["public"]["Tables"][T]["Insert"]>
      | Partial<Database["public"]["Tables"][T]["Update"]>;
  }

  async function insertSupabase<T extends keyof Database["public"]["Tables"]>(
    options: InsertUpdateOptions<T>,
  ): Promise<Database["public"]["Tables"][T]["Row"]> {
    const { table, data } = options;
    const { data: newRow, error } = await client
      .from(table)
      .upsert({ ...data })
      .select();

    if (error) {
      throw error;
    }

    return newRow?.[0] as Database["public"]["Tables"][T]["Row"];
  }

  async function updateSupabase<T extends keyof Database["public"]["Tables"]>(
    options: InsertUpdateOptions<T> & { key?: string; value: any },
  ): Promise<Database["public"]["Tables"][T]["Row"]> {
    const { table, key = "id", value, data } = options;
    const { data: updatedRows, error } = await client
      .from(table)
      .update(data)
      .eq(key, value)
      .select();

    if (error) {
      throw error;
    }

    return updatedRows?.[0] as Database["public"]["Tables"][T]["Row"];
  }

  async function deleteSupabase<T extends keyof Database["public"]["Tables"]>(
    table: T,
    field: string,
    value: any,
  ): Promise<void> {
    const request = client.from(table).delete().eq(field, value);

    const { error } = await request;
    if (error) {
      throw error;
    }
  }

  interface SelectOptions<T extends keyof Database["public"]["Tables"]> {
    table: T;
    filters?: FilterCondition[];
    ascendingDate?: boolean;
    queryOptions?: any;
    offset?: number;
    limit?: number;
    orderByField?: string;
    orderByAscending?: boolean;
  }

  async function selectSupabase<T extends keyof Database["public"]["Tables"]>(
    options: SelectOptions<T>,
  ): Promise<Database["public"]["Tables"][T]["Row"][]> {
    const {
      table,
      filters = [],
      queryOptions = "*",
      offset = 0,
      limit = 10,
      orderByField = "created_at",
      orderByAscending = true,
    } = options;

    let request = client.from(table).select(queryOptions);

    for (const filter of filters) {
      const { field, value, operator = "eq" } = filter;
      if (operator === "eq") {
        request = request.eq(field, value);
      } else if (operator === "ilike") {
        request = request.ilike(field, value);
      } else if (operator === "contains") {
        request = request.contains(field, value);
      }
    }

    if (orderByField) {
      request = request.order(orderByField, { ascending: orderByAscending });
    }

    if (offset >= 0) {
      request = request.range(offset, offset + limit - 1);
    }

    const { data: selectedRows, error } = await request.select();
    if (error) {
      throw error;
    }
    return selectedRows as Database["public"]["Tables"][T]["Row"][];
  }

  async function signIn(
    email: string,
    password: string,
    autoRoute: boolean = true,
  ) {
    const { error } = await client.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      throw error;
    }
    if (autoRoute) {
      await navigateTo("/profile");
    }
    return true;
  }

  async function signUp(
    email: string,
    password: string,
    autoRoute: boolean = true,
  ) {
    const { data, error } = await client.auth.signUp({
      email,
      password,
    });
    if (error) {
      throw error;
    }
    if (autoRoute) {
      await navigateTo("/profile");
    }
    return data;
  }

  async function signOut(autoRoute: boolean = true) {
    const { error } = await client.auth.signOut();
    if (error) {
      throw error;
    }
    if (autoRoute) {
      await navigateTo("/login");
    }
  }

  async function getTags(query: string = "*") {
    try {
      const { data, error } = await client.from("Tags").select(query);
      if (error) {
        return [];
      }
      return data;
    } catch (error) {
      return [];
    }
  }

  return {
    signIn,
    signUp,
    signOut,
    getTags,
    select: selectSupabase,
    insert: insertSupabase,
    update: updateSupabase,
    delete: deleteSupabase,
    storage: client.storage,
  };
};
