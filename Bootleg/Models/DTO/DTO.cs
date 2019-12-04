namespace Bootleg.Models.DTO
{
	public class DTO<T> : Status
	{
		public string Id { get; set; }
		public T Data { get; set; }
	}
}
