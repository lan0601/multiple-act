import { supabase } from "../../lib/supabase";

export default async function handler(req, res) {
  if (req.method === "GET") {
    // Get all todo
    const { data, error } = await supabase.from("todo").select("*");
    if (error) return res.status(500).json({ error: error.message });
    res.status(200).json(data);
  } 
  
  else if (req.method === "POST") {
    // Create a new employee
    const { name, position, salary } = req.body;
    const { data, error } = await supabase.from("todo").insert([{ name, position, salary }]);
    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data);
  } 
  
  else if (req.method === "PUT") {
    // Update an employee
    const { id, name, position, salary } = req.body;
    const { data, error } = await supabase
      .from("todo")
      .update({ name, position, salary })
      .eq("id", id);
    if (error) return res.status(500).json({ error: error.message });
    res.status(200).json(data);
  } 
  
  else if (req.method === "DELETE") {
    // Delete an employee
    const { id } = req.body;
    const { error } = await supabase.from("todo").delete().eq("id", id);
    if (error) return res.status(500).json({ error: error.message });
    res.status(200).json({ message: "Employee deleted" });
  } 
  
  else {
    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
