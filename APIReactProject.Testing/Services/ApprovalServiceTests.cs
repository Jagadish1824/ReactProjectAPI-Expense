using NUnit.Framework;
using Moq;
using System.Collections.Generic;
using System.Threading.Tasks;
using ReactProjectAPI.Application.DTOs;
using ReactProjectAPI.Application.Services;
using ReactProjectAPI.Domain.Entities;
using ReactProjectAPI.Infrastructure.Interfaces;
using AutoMapper;
using Microsoft.Extensions.Logging;

namespace APIReactProject.Testing.Services
{
    [TestFixture]
    public class ApprovalServiceTests
    {
        private Mock<IApprovalRepository> _mockApprovalRepository;
        private Mock<IClaimRepository> _mockClaimRepository;
        private Mock<IMapper> _mockMapper;
        private Mock<ILogger<ApprovalService>> _mockLogger;
        private ApprovalService _approvalService;

        [SetUp]
        public void Setup()
        {
            _mockApprovalRepository = new Mock<IApprovalRepository>();
            _mockClaimRepository = new Mock<IClaimRepository>();
            _mockMapper = new Mock<IMapper>();
            _mockLogger = new Mock<ILogger<ApprovalService>>();
            _approvalService = new ApprovalService(_mockApprovalRepository.Object, _mockClaimRepository.Object, _mockMapper.Object, _mockLogger.Object);
        }

        [Test]
        public async Task GetAllAsync_ShouldReturnAllApprovals()
        {
            // Arrange
            var approvals = new List<Approval>
            {
                new Approval { ApprovalId = 1, ClaimId = 1, Status = "Approved", ApprovedBy = 2 },
                new Approval { ApprovalId = 2, ClaimId = 2, Status = "Rejected", ApprovedBy = 2 }
            };
            var approvalDtos = new List<ApprovalDto>
            {
                new ApprovalDto { ApprovalId = 1, ClaimId = 1, Status = "Approved", ApprovedBy = 2 },
                new ApprovalDto { ApprovalId = 2, ClaimId = 2, Status = "Rejected", ApprovedBy = 2 }
            };

            _mockApprovalRepository.Setup(repo => repo.GetAllAsync()).ReturnsAsync(approvals);
            _mockMapper.Setup(mapper => mapper.Map<IEnumerable<ApprovalDto>>(approvals)).Returns(approvalDtos);

            // Act
            var result = await _approvalService.GetAllAsync();

            // Assert
            Assert.AreEqual(2, ((List<ApprovalDto>)result).Count);
        }

        [Test]
        public async Task GetByIdAsync_ShouldReturnApproval_WhenExists()
        {
            // Arrange
            var approval = new Approval { ApprovalId = 1, ClaimId = 1, Status = "Approved", ApprovedBy = 2 };
            var approvalDto = new ApprovalDto { ApprovalId = 1, ClaimId = 1, Status = "Approved", ApprovedBy = 2 };

            _mockApprovalRepository.Setup(repo => repo.GetByIdAsync(1)).ReturnsAsync(approval);
            _mockMapper.Setup(mapper => mapper.Map<ApprovalDto>(approval)).Returns(approvalDto);

            // Act
            var result = await _approvalService.GetByIdAsync(1);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.ApprovalId);
            Assert.AreEqual("Approved", result.Status);
        }

        [Test]
        public async Task CreateAsync_ShouldReturnCreatedApproval_WhenNewApproval()
        {
            // Arrange
            var createDto = new CreateApprovalDto
            {
                ClaimId = 1,
                Status = "Approved",
                Comments = "Valid expense"
            };
            var claim = new Claim { ClaimId = 1, Status = "Pending" };
            var createdApproval = new Approval { ApprovalId = 1, ClaimId = 1, Status = "Approved", ApprovedBy = 2 };
            var approvalDto = new ApprovalDto { ApprovalId = 1, ClaimId = 1, Status = "Approved", ApprovedBy = 2 };

            _mockApprovalRepository.Setup(repo => repo.GetAllAsync()).ReturnsAsync(new List<Approval>());
            _mockApprovalRepository.Setup(repo => repo.CreateAsync(It.IsAny<Approval>())).ReturnsAsync(createdApproval);
            _mockClaimRepository.Setup(repo => repo.GetByIdAsync(1)).ReturnsAsync(claim);
            _mockClaimRepository.Setup(repo => repo.UpdateAsync(It.IsAny<Claim>())).ReturnsAsync(claim);
            _mockMapper.Setup(mapper => mapper.Map<ApprovalDto>(createdApproval)).Returns(approvalDto);

            // Act
            var result = await _approvalService.CreateAsync(createDto, 2);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.ApprovalId);
            Assert.AreEqual("Approved", result.Status);
        }

        [Test]
        public async Task CreateAsync_ShouldUpdateExistingApproval_WhenApprovalExists()
        {
            // Arrange
            var createDto = new CreateApprovalDto
            {
                ClaimId = 1,
                Status = "Rejected",
                Comments = "Invalid receipt"
            };
            var existingApproval = new Approval { ApprovalId = 1, ClaimId = 1, Status = "Pending", ApprovedBy = 2 };
            var claim = new Claim { ClaimId = 1, Status = "Pending" };
            var updatedApproval = new Approval { ApprovalId = 1, ClaimId = 1, Status = "Rejected", ApprovedBy = 2 };
            var approvalDto = new ApprovalDto { ApprovalId = 1, ClaimId = 1, Status = "Rejected", ApprovedBy = 2 };

            _mockApprovalRepository.Setup(repo => repo.GetAllAsync()).ReturnsAsync(new List<Approval> { existingApproval });
            _mockApprovalRepository.Setup(repo => repo.UpdateAsync(It.IsAny<Approval>())).ReturnsAsync(updatedApproval);
            _mockClaimRepository.Setup(repo => repo.GetByIdAsync(1)).ReturnsAsync(claim);
            _mockClaimRepository.Setup(repo => repo.UpdateAsync(It.IsAny<Claim>())).ReturnsAsync(claim);
            _mockMapper.Setup(mapper => mapper.Map<ApprovalDto>(updatedApproval)).Returns(approvalDto);

            // Act
            var result = await _approvalService.CreateAsync(createDto, 2);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual("Rejected", result.Status);
        }

        [Test]
        public async Task UpdateAsync_ShouldReturnUpdatedApproval()
        {
            // Arrange
            var updateDto = new UpdateApprovalDto
            {
                Status = "Approved",
                Comments = "Updated comments"
            };
            var existingApproval = new Approval { ApprovalId = 1, ClaimId = 1, Status = "Pending", ApprovedBy = 2 };
            var claim = new Claim { ClaimId = 1, Status = "Pending" };
            var updatedApproval = new Approval { ApprovalId = 1, ClaimId = 1, Status = "Approved", ApprovedBy = 2 };
            var approvalDto = new ApprovalDto { ApprovalId = 1, ClaimId = 1, Status = "Approved", ApprovedBy = 2 };

            _mockApprovalRepository.Setup(repo => repo.GetByIdAsync(1)).ReturnsAsync(existingApproval);
            _mockApprovalRepository.Setup(repo => repo.UpdateAsync(It.IsAny<Approval>())).ReturnsAsync(updatedApproval);
            _mockClaimRepository.Setup(repo => repo.GetByIdAsync(1)).ReturnsAsync(claim);
            _mockClaimRepository.Setup(repo => repo.UpdateAsync(It.IsAny<Claim>())).ReturnsAsync(claim);
            _mockMapper.Setup(mapper => mapper.Map<ApprovalDto>(updatedApproval)).Returns(approvalDto);

            // Act
            var result = await _approvalService.UpdateAsync(1, updateDto);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual("Approved", result.Status);
        }

        [Test]
        public async Task UpdateAsync_ShouldReturnNull_WhenApprovalNotExists()
        {
            // Arrange
            var updateDto = new UpdateApprovalDto { Status = "Approved" };
            _mockApprovalRepository.Setup(repo => repo.GetByIdAsync(999)).ReturnsAsync((Approval)null);

            // Act
            var result = await _approvalService.UpdateAsync(999, updateDto);

            // Assert
            Assert.IsNull(result);
        }

        [Test]
        public async Task DeleteAsync_ShouldReturnTrue_WhenApprovalExists()
        {
            // Arrange
            _mockApprovalRepository.Setup(repo => repo.DeleteAsync(1)).ReturnsAsync(true);

            // Act
            var result = await _approvalService.DeleteAsync(1);

            // Assert
            Assert.AreEqual(true, result);
        }

        [Test]
        public async Task DeleteAsync_ShouldReturnFalse_WhenApprovalNotExists()
        {
            // Arrange
            _mockApprovalRepository.Setup(repo => repo.DeleteAsync(999)).ReturnsAsync(false);

            // Act
            var result = await _approvalService.DeleteAsync(999);

            // Assert
            Assert.AreEqual(false, result);
        }
    }
}