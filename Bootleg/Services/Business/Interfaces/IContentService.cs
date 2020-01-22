using Bootleg.Models.Documents;
using Bootleg.Models.DTO;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Bootleg.Services.Business.Interfaces
{
	public interface IContentService
	{
		Task<DTO<List<string>>> AddContent(Content content);
		Task<DTO<List<Content>>> GetAllContent(string userId);
	}
}
