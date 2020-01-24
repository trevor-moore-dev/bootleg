using Bootleg.Models.Documents;
using Bootleg.Models.DTO;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Bootleg.Services.Business.Interfaces
{
	public interface IContentService
	{
		Task<DTO<Tuple<Content, User>>> AddContentForUser(Content content, User user);
		Task<DTO<List<Content>>> GetAllContent(User user);
	}
}
