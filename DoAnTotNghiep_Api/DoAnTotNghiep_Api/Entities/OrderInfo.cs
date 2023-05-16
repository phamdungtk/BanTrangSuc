using System.ComponentModel.DataAnnotations;

namespace DoAnTotNghiep_Api.Entities
{
    public class OrderInfo
    {
        [Key]
        public string OrderId { get; set; }
        public int Amount { get; set; }
        public string OrderDescription { get; set; }

        public string BankCode { get; set; }
        public int Status { get; set; }
        public DateTime CreatedDate { get; set; }
        public decimal vnp_TransactionNo { get; set; }
        public string vpn_Message { get; set; }
        public string vpn_TxnResponseCode { get; set; }


    }
}
